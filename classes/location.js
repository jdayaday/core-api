// Required modules
const mongoose = require('mongoose');

// Model & Schema
const LocationModel = mongoose.model('Location', mongoose.Schema({
    location_code: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 16,
        unique: true
    },
    description: {
        type: String,
        minlenght: 1,
        maxlenght: 255
    },
    area: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
    },
    shelf_bin:{
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
    },
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

// Class
class Location {
    async getLocations() {
        const location = await LocationModel.find().sort(location_code);

        return location;
    }

    async getLocation(id) {
        // validate ObjectID
        if(!mongoose.Types.ObjectId.isValid(id)) return null;

        const location = await LocationModel.findById(id);

        return location;
    }

    async addLocation(location_code, description, area, shelf_bin) {
        // Check if item is already existing
        let location = await LocationModel.findOne({location_code: location_code});
        if(location) return null;

        location = new LocationModel({
            location_code: location_code,
            description: description,
            area: area,
            shelf_bin: shelf_bin,
            updated: Date.now()
        });

        await location.save();

        return location;
    }

    async updateLocation(id, location_code, description, area, shelf_bin) {
        const location = await LocationModel.findByIdAndUpdate(id, {
            location_code: location_code,
            description: description,
            area: area,
            shelf_bin: shelf_bin,
            updated: Date.now()
        },
        {new: true});

        return location;
    }

    async deleteLocation(id) {
        const location = await LocationModel.findByIdAndRemove(id);
        
        return location;
    }
}

module.exports = Location;