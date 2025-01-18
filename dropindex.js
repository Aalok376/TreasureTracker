const mongoose = require('mongoose');
const uri = 'mongodb+srv://deekshya:<db_password>@cluster0.usx4j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster'
(async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Drop the unique index on "receiver_id"
        const result = await mongoose.connection.db.collection('messages').dropIndex('receiver_id_1');
        console.log('Dropped index:', result);

        mongoose.disconnect();
    } catch (error) {
        console.error('Error dropping index:', error.message);
    }
})();
