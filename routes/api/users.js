const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../keys/keys');
const express = require("express");
const router = express.Router();
const userService = require('../../service/user.service');
const logger = require('../../logger/logger');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

router.get("/", async (req, res) => {
  logger.info('getting all users')
  return await userService.getUsers().then(data =>
    res.json(data)
  );
});

router.get("/:id", async (req, res) => {
  logger.info('getting user by id: ' + req.params.id);
  return await userService.getUser(req.params.id).then(data =>
    res.json(data)
  );
});

router.post('/register', async (req, res) => {
  logger.info("register user payload: ", req.body);
  // ensure nobody registers with duplicate emails
  try {
    const { errors, isValid } = validateRegisterInput(req.body.user);

    if (!isValid) {
      return res.status(400).json({
        statusCode: "VALIDATION_ERROR",
        message: Object.values(errors).join(', ')
      });
    }

    const user = await userService.getUserByEmail(req.body.user.email);
    if (user) {
      return res.status(400).json({
        statusCode: "EMAIL_ALREADY_EXISTS",
        message: "A user has already registered with this address"
      });
    } else {
      const newUser = {
        email: req.body.user.email,
        username: req.body.user.username,
        password_digest: req.body.user.password,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password_digest, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password_digest = hash;
          await userService.createUser(newUser)
          const savedUser = userService.getUserByEmail(newUser.email);
          const payload = { id: savedUser.id, username: savedUser.username };
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            });
        }
        );
      })
    };
  } catch (e) {
    logger.error('error registering user: ' + e);
    res.status(400).json(e);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body.user);

    if (!isValid) {
      return res.status(400).json({
        statusCode: "VALIDATION_ERROR",
        message: Object.values(errors).join(', ')
      });
    }

    const username = req.body.user.username;
    const password = req.body.user.password;
    const user = await userService.getUserByUsername(username);

    if (!user) {
      return res.status(404).json({
        statusCode: "USER_NOT_FOUND",
        message: 'This user does not exist'
      });
    } else {
      bcrypt.compare(password, user.password_digest).then(isMatch => {
        if (isMatch) {
          const payload = { id: user.id, username: user.username };
          // pass jwt token to client
          jwt.sign(
            payload,
            keys.secretOrKey,
            // Tell the key to expire in one hour
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });
        } else {
          return res.status(400).json({
            statusCode: "INCORRECT_PASSWORD",
            message: 'Incorrect password'
          });
        }
      })
    }
  } catch (e) {
    logger.error('error logging in user: ' + e);
    res.status(400).json(e);
  }
});

router.put('/', async (req, res) => {
  logger.info('update user payload: ', req.body);
  return await userService.updateUser(req.body.user).then(data =>
    res.json(data)
  );
});

router.delete('/:id', async (req, res) => {
  userService.deleteUser(req.params.id).then(data =>
    res.json(data)
  );
});

module.exports = router;