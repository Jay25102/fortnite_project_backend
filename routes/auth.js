// import jsonschema from "jsonschema";
// import User from "../models/user.js";
// import express from "express";
// import { BadRequestError } from "../helpers/expressError.js";
// import createToken from "../helpers/tokens.js";
// import userAuth from "../schemas/userAuth.json";
// import userRegister from "../schemas/userRegister.json";

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const createToken = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../helpers/expressError");

const router = new express.Router();

/**
 * POST: /auth/token: { username, password } => { token }
 * 
 * Validates user and password and returns JWT token used
 * for future authentications.
 */
router.post("/token", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token });
    }
    catch (err) {
        return next(err);
    }
});

router.post("/register", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newUser = await User.Register({ ...req.body });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;