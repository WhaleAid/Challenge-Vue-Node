const express = require('express')
const createError = require('http-errors')
const mongoose = require('mongoose')

const { User } = require('../models')

const getOne = async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        res.json({ user })
    } catch (error) {
        console.log(error)
        return next(createError(500))
    }
}

const getAll = async (req, res, next) => {
    try {
        const users = await User.find()
        res.json({ users })
    } catch (error) {
        console.log(error)
        return next(createError(500))
    }
}

const createOne = async (req, res, next) => {
    const { name,email, password, passwordConfirm , date_of_birth } = req.body
    try {
        const user = await User.create({
                name: name,
                date_of_birth: date_of_birth,
                email : email,
                password : password,
                passwordConfirm : passwordConfirm 
            });
        // await user.save()
        res.json({ user })
    } catch (error) {
        console.log(error)
        return next(createError(500))
    }
}

const deleteOne = async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await User.findByIdAndDelete(id)

        // ici ne pas renvoyer le user supprimé. renvoyer uniquement un message de sucess      
        
        res.json({ user })
    } catch (error) {
        console.log(error)
        return next(createError(500))
    }
}

const updateOne = async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    try {
        const user = await User.updateOne({ _id: id }, { name: name })
        res.json({ user })
    } catch (error) {
        console.log(error)
        return next(createError(500))
    }
}

let router = express.Router()

router.get('/:id', getOne)
router.post('/', createOne)
router.get('/', getAll)
router.delete('/:id', deleteOne)
router.put('/:id', updateOne)

module.exports = router