const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')


const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find()
    res.status(200).json(goals)
    }
)

const setGoals = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please add text field.')
    }

    const goal = await Goal.create(
        {
            text: req.body.text,
        }
    )

    res.status(200).json(goal)
})

const updateGoals = asyncHandler(async (req, res) => {
        const goal = await Goal.findById(req.params.id)

        if (!goal) {
            res.status(400)
            throw new Error('Goal not found')
        }
        
        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})

        res.status(201).json(updatedGoal)
        }
    )

const deleteGoals = asyncHandler(async (req, res) => {

        const goal = await Goal.findById(req.params.id)
        
        if (!goal) {
            res.status(400)
            throw new Error('Goal not found')
        }

        const deletedGoal = await Goal.findByIdAndRemove(req.params.id, req.body)

        res.status(201).json(deletedGoal)
        }
    )


module.exports = {
    getGoals, setGoals, updateGoals, deleteGoals
}