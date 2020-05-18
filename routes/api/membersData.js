const express = require('express')
const router = express.Router()
const members = require('../../members')
const uuid = require('uuid')
const Joi = require('joi')

// Get All Members
router.get('/', (req, res) => {
    res.json(members)
})

// Get Single Member
router.get('/:id', (req, res) => {
    // checking if the data is present
    const foundData = members.some(member => member.id === parseInt(req.params.id))
    if(foundData) {
        res.json(members.filter(member => member.id === parseInt(req.params.id)))
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}`})
    }
})

// Creating a new member
router.post('/', (req, res) => {
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: "active"
    }

    const { error } = validateMember(req.body)

    if(!error) {
        members.push(newMember)
        res.json(members)
    } else {
        res.status(400).send(error.details[0].message)
    }
})

// Updating a member
router.put('/:id', (req, res) => {
    // checking if the member is present first
    const foundData = members.some(member => member.id === parseInt(req.params.id))

    // validate the data before update
    if(foundData) {
        const updMember = req.body
        const { error } = validateMember(updMember)

        // update the member with new data
        if(!error) {
            members.forEach(member => {
                if(member.id === parseInt(req.params.id)) {
                    member.name = updMember.name ? updMember.name : member.name
                    member.email = updMember.email ? updMember.email : member.email
                    res.json({msg: 'Member Updated', member})
                }
            })
        }
        else {
           return res.status(400).send(error.details[0].message)
        }
    }
    else {
        return res.status(404).send(`No member with the id ${req.params.id}`)
    }
}) 

// Delete a member
router.delete('/:id', (req, res) => {
    // checking if the member is present first
    const foundData = members.some(member => member.id === parseInt(req.params.id))

    // deleting the member from the collection
    if(foundData) {
        res.json({
            msg: 'Member Deleted',
            members: members.filter(member => member.id !== parseInt(req.params.id))
        })
    }
    else {
        res.status(404).json({msg: `No member with the id ${req.params.id}`})
    }

    // The above way is not the way of doing it as when you do GET request for all members
    // We will have the one we requested to delete for. So, efficient way is as below

    if(foundData) {
        const member = members.find(m => m.id === parseInt(req.params.id))
        const index = members.indexOf(member)
        console.log(index)
        members.splice(index, 1)
        res.json({
            msg: 'Member Deleted',
            members: members
        })
    }
    else {
        res.status(404).json({msg: `No member with the id ${req.params.id}`})
    }
})

function validateMember(member) {
    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required()
    }
    return Joi.validate(member, schema)
}

module.exports = router