const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const userService = require('../../service/user.service');
const logger = require('../../logger/logger');

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
    const user = await userService.getUserByEmail(req.body.user.email);
    if (user) {
      return res.status(400).json({ email: "A user has already registered with this address" });
    } else {
      const newUser = {
        email: req.body.user.email,
        username: req.body.user.username,
        password: req.body.user.password,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          return await userService.createUser(req.body.user).then(data =>
            res.json(data)
          );
        })
      });

    }
  } catch (e) {
    logger.error('error registering user: ' + e);
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