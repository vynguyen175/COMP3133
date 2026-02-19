const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

const User = require('../models/User');
const Employee = require('../models/Employee');
const cloudinary = require('../config/cloudinary');

const resolvers = {
  Query: {
    login: async (_, { usernameOrEmail, password }) => {
      if (!usernameOrEmail || !password) {
        throw new GraphQLError('Username/email and password are required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      if (!user) {
        throw new GraphQLError('User not found. Please check your credentials.', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new GraphQLError('Invalid password. Please try again.', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { token, user };
    },

    getAllEmployees: async () => {
      try {
        const employees = await Employee.find();
        return employees;
      } catch (error) {
        throw new GraphQLError(`Failed to fetch employees: ${error.message}`, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    searchEmployeeById: async (_, { eid }) => {
      if (!eid) {
        throw new GraphQLError('Employee ID is required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const employee = await Employee.findById(eid);

      if (!employee) {
        throw new GraphQLError(`Employee with ID ${eid} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return employee;
    },

    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
      if (!designation && !department) {
        throw new GraphQLError(
          'At least one of designation or department must be provided',
          { extensions: { code: 'BAD_USER_INPUT' } }
        );
      }

      const orConditions = [];
      if (designation) orConditions.push({ designation: { $regex: designation, $options: 'i' } });
      if (department) orConditions.push({ department: { $regex: department, $options: 'i' } });

      const employees = await Employee.find({ $or: orConditions });
      return employees;
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      if (!username || !email || !password) {
        throw new GraphQLError('Username, email, and password are all required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      if (password.length < 6) {
        throw new GraphQLError('Password must be at least 6 characters long', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        throw new GraphQLError('Please provide a valid email address', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        throw new GraphQLError('Username is already taken', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        throw new GraphQLError('An account with this email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      return await user.save();
    },

    addEmployee: async (
      _,
      {
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining,
        department,
        employee_photo,
      }
    ) => {
      if (salary < 1000) {
        throw new GraphQLError('Salary must be at least 1000', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        throw new GraphQLError('Please provide a valid email address', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
      if (existingEmployee) {
        throw new GraphQLError('An employee with this email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      let photoUrl = employee_photo || null;
      if (
        employee_photo &&
        (employee_photo.startsWith('data:image') || employee_photo.startsWith('data:'))
      ) {
        try {
          const uploadResult = await cloudinary.uploader.upload(employee_photo, {
            folder: 'employee_photos',
            resource_type: 'image',
          });
          photoUrl = uploadResult.secure_url;
        } catch (uploadError) {
          throw new GraphQLError(`Failed to upload image to Cloudinary: ${uploadError.message}`, {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          });
        }
      }

      const employee = new Employee({
        first_name,
        last_name,
        email: email.toLowerCase(),
        gender,
        designation,
        salary,
        date_of_joining: new Date(date_of_joining),
        department,
        employee_photo: photoUrl,
      });

      return await employee.save();
    },

    updateEmployee: async (_, { eid, ...updateFields }) => {
      if (!eid) {
        throw new GraphQLError('Employee ID is required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      if (updateFields.salary !== undefined && updateFields.salary < 1000) {
        throw new GraphQLError('Salary must be at least 1000', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      if (
        updateFields.employee_photo &&
        (updateFields.employee_photo.startsWith('data:image') ||
          updateFields.employee_photo.startsWith('data:'))
      ) {
        try {
          const uploadResult = await cloudinary.uploader.upload(
            updateFields.employee_photo,
            { folder: 'employee_photos', resource_type: 'image' }
          );
          updateFields.employee_photo = uploadResult.secure_url;
        } catch (uploadError) {
          throw new GraphQLError(
            `Failed to upload image to Cloudinary: ${uploadError.message}`,
            { extensions: { code: 'INTERNAL_SERVER_ERROR' } }
          );
        }
      }

      if (updateFields.date_of_joining) {
        updateFields.date_of_joining = new Date(updateFields.date_of_joining);
      }

      if (updateFields.email) {
        updateFields.email = updateFields.email.toLowerCase();
      }

      const employee = await Employee.findByIdAndUpdate(
        eid,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!employee) {
        throw new GraphQLError(`Employee with ID ${eid} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return employee;
    },

    deleteEmployee: async (_, { eid }) => {
      if (!eid) {
        throw new GraphQLError('Employee ID is required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const employee = await Employee.findByIdAndDelete(eid);

      if (!employee) {
        throw new GraphQLError(`Employee with ID ${eid} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return `Employee ${employee.first_name} ${employee.last_name} (ID: ${eid}) was successfully deleted`;
    },
  },
};

module.exports = resolvers;
