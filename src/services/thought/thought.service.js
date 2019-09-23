const mongoose = require('mongoose');
const { ThoughtModel } = require('../../models');

class ThoughtService {
  constructor() {
    this.ThoughtModel = ThoughtModel;
  }

  async listThought({ user }, params = {
    limit: 100, offset: 1, filter: {}, sort: {}
  }) {
    const {
      limit = 100, offset = 1, filter, sort
    } = params;

    let sortObject = { isPinned: -1, createdAt: -1 };
    if (sort && Object.keys(sort).length) {
      sortObject = {};
      Object.keys(sort).forEach((key) => {
        if (sort[key] === 'DESC') {
          sortObject[key] = -1;
        }
        if (sort[key] === 'ASC') {
          sortObject[key] = 1;
        }
      });
    }

    let conditions = {
      isDeleted: false,
      user: mongoose.Types.ObjectId(user._id)
    };

    if (filter && Object.keys(filter).length) {
      if ('q' in filter) {
        conditions.$or = conditions.$or || [];
        conditions.$or.push({ title: { $regex: filter.q, $options: 'gi' } }, { description: { $regex: filter.q, $options: 'gi' } });
      }
      if ('isPinned' in filter) {
        conditions = { ...conditions, isPinned: filter.isPinned };
      }
      if ('isAchieved' in filter) {
        if (filter.isAchieved === true) {
          conditions = { ...conditions, isAchieved: true };
        } else {
          conditions.$or = conditions.$or || [];
          conditions.$or.push({
            isAchieved: false
          });
          conditions.$or.push({
            isAchieved: null
          });
        }
      }
    }

    try {
      const response = await this.ThoughtModel
        .aggregate([
          {
            $match: conditions
          },
          {
            $facet: {
              dataList: [
                {
                  $sort: sortObject
                },
                { $skip: (offset - 1) * limit },
                { $limit: limit }
              ],
              count: [
                {
                  $group: {
                    _id: null,
                    count: { $sum: 1 }
                  }
                }
              ]
            }
          }
        ]);
      const { dataList, count } = response[0];
      return Promise.resolve({
        data: dataList,
        totalCount: count[0] && count[0].count ? count[0].count : 0
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async addThought({ user }, body) {
    const { _id: userId } = user;
    try {
      await this.ThoughtModel({ ...body, user: userId }).save();
      return { message: 'Thought has been succesfully added', ok: true };
    } catch (err) {
      return Promise.reject(err);
    }
  }


  async updateThought({ user }, { thoughtId }, body) {
    const { _id: userId } = user;
    try {
      const response = await this.ThoughtModel.updateOne({
        user: userId, _id: thoughtId
      }, {
        $set: {
          ...body,
          $currentDate: {
            updatedAt: true
          }
        }
      });
      if (response && response.n !== 0) {
        return { message: 'Thought has been succesfully updated', ok: true };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async deleteThought({ user }, { thoughtId }) {
    try {
      const response = await this.ThoughtModel.deleteOne({
        user: user._id, _id: thoughtId
      });
      if (response && response.n !== 0) {
        return { ok: true, message: 'Thought deleted successfully' };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = new ThoughtService();
