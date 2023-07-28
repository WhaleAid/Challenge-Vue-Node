const express = require('express');
const createError = require('http-errors');

const { User } = require('../models');

const handleDBError = (error, res, next) => {
    console.error(error);
    if (error.name === 'ValidationError') {
        const validationErrors = {};
        for (const field in error.errors) {
            validationErrors[field] = error.errors[field].message;
        }
        return res.status(400).json({
            status : "fail",
            message : {
                errors: validationErrors
            }
        });
    }
    return next(createError(500));
};

const getOne = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return next(createError(404));
        res.status(200).json({ status : "success", data : { user } });
    } catch (error) {
        handleDBError(error, res, next);
    }
};

const getAll = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ status : 'success', count : users.length, data : { users } });
    } catch (error) {
        handleDBError(error, res, next);
    }
};

const createOne = async (req, res, next) => {
    const { name, email, password, passwordConfirm, date_of_birth } = req.body;
    try {
        const user = await User.create({ name, email, password, passwordConfirm, date_of_birth });
        res.status(201).json({ status : "success", data : { user } });
    } catch (error) {
        handleDBError(error, res, next);
    }
};

const deleteOne = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ status : "fail", message: 'user not found' });
        res.status(200).json({ status : "success", message : 'user deleted successfully' });
    } catch (error) {
        handleDBError(error, res, next);
    }
};

const updateOne = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(201).json({ status : "success", data : { user } });
    } catch (error) {
        handleDBError(error, res, next);
    }
};

let router = express.Router();

router.route('/:id')
    .get(getOne)
    .delete(deleteOne)
    .put(updateOne);

router.route('/')
    .get(getAll)
    .post(createOne);

module.exports = router;
