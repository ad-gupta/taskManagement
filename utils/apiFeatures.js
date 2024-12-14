class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Search functionality
  search() {
    const keyword = this.queryStr.keyword
      ? {
          title: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter functionality (commented out in your original code)
  filter() {
    const queryCopy = { ...this.queryStr };

    // Fields to exclude from filtering
    const removeFields = ["keyword", "sort"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filtering by status (Completed or Pending)
    if (queryCopy.status) {
      queryCopy.status = { $regex: new RegExp(queryCopy.status, "i") }; // Case-insensitive match for 'Pending'
    }

    // Apply filters dynamically
    this.query = this.query.find(queryCopy);

    return this;
  }

  // Sort functionality
  sort() {
    if (this.queryStr.sort) {
      const sortCriteria = this.queryStr.sort;

      // Sorting for startTime and endTime
      if (sortCriteria === "startDate_asc") {
        this.query = this.query.sort({ startTime: 1 }); // Ascending
      } else if (sortCriteria === "startDate_desc") {
        console.log(sortCriteria, this.query);
        this.query = this.query.sort({ startTime: -1 }); // Descending
      } else if (sortCriteria === "endDate_asc") {
        this.query = this.query.sort({ endTime: 1 }); // Ascending
      } else if (sortCriteria === "endDate_desc") {
        this.query = this.query.sort({ endTime: -1 }); // Descending
      }

      // Sorting by priority
      else if (sortCriteria === "priority_asc") {
        this.query = this.query.sort({ priority: 1 }); // Ascending
      } else if (sortCriteria === "priority_desc") {
        this.query = this.query.sort({ priority: -1 }); // Descending
      }
    }
    //   console.log(this.query);

    return this;
  }
}

export default ApiFeatures;
