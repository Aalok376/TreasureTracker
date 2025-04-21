const Contact = require('../models/contacts')

const contact = async (req, res) => {
    const { Name, Email, Subject, Message } = req.body

    if (!Message || Message.trim() === '') {
        return res.status(400).json({ msg: 'Please provide a valid comment.' });
    }

    try {
        const contacts = new Contact({ Name, Email, Subject, Message });
        await contacts.save();

        return res.status(200).json({ msg: 'Contact successful.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error contacting.' });
    }

}
module.exports={contact}