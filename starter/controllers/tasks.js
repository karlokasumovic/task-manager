const Task = require('../models/task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')
const getAllTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find({})
    res.status(200).json({ tasks })
})
//asyncWrapper can be used on all of the other functions but im not doing that now i just want to have 2 options written here as examples
const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body)
        res.status(200).json({ task })
    } catch (error) {
        res.status(500).json({ msg: error })
    }

}

const getTask = async (req, res, next) => {
    try {
        const { id: taskID } = req.params
        const task = await Task.findOne({ _id: taskID })
        if (!task) {
            //the following line of code can be used in deleteTask and updateTask as well but im going to leave it like this so that once again i have it both as an example
            return next(createCustomError(`No tasks with the id: ${taskID}`, 404))

            //const error = new Error('Not Found');
            //error.status = 404;
            //return next(error)
            //return res.status(404).json({ msg: `No tasks with the id: ${taskID}` })
        }

        res.status(200).json({ task })
    } catch (error) {
        res.status(500).json({ msg: error })
    }

}

const deleteTask = asyncWrapper(async (req, res) => {
    const { id: taskID } = req.params
    const task = await Task.findOneAndDelete({ _id: taskID })
    if (!task) {
        return res.status(404).json({ msg: `No tasks with the id: ${taskID}` })
    }
    res.status(200).json({ task })

    //following are fifferent responses you can have 
    //res.status(200).send()
    //res.status(200).json({ task:null,status:'success'})

})

const updateTask = async (req, res) => {
    try {
        const { id: taskID } = req.params
        const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
            new: true,
            runValidators: true,
            //overwrite:true - used when you use put instead of patch so that u overwrite the data
        })
        if (!task) {
            return res.status(404).json({ msg: `No tasks with the id: ${taskID}` })
        }
        res.status(200).json({ task })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}