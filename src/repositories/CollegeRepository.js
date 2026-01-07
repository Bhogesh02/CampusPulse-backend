const BaseRepository = require('./BaseRepository');
const College = require('../models/College');

class CollegeRepository extends BaseRepository {
    constructor() {
        super(College);
    }

    async findByName(name) {
        return await this.model.findOne({ name });
    }
}

module.exports = CollegeRepository;
