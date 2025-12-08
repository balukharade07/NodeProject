1️⃣$match → Filter documents (like WHERE)
    { $match: { age: { $gt: 20 } } }

2️⃣ $project → Show/Hide specific fields
    { 
        $project: {
            name: 1,
            age: 1,
            password: 0   // remove password
        }
    }
3️⃣ $sort → Sort documents
    { $sort: { age: -1 } }  // descending
4️⃣ $limit → Limit number of documents
    { $limit: 5 }
5️⃣ $skip → Skip documents (used in pagination)
    { $skip: 10 }  // skip first 10
6️⃣ $group → Group by field (like SQL GROUP BY)
    {
        $group: {
            _id: "$city",
            totalUsers: { $sum: 1 },
            averageAge: { $avg: "$age" },
            users: { $push: "$$ROOT" }
        }
    }
    Common group operators:

    Operator	Meaning
    $sum	sum or count ($sum: 1)
    $avg	average
    $min	minimum value
    $max	maximum value
    $push	push entire doc into array
    $addToSet	push unique values

7️⃣ $lookup → JOIN between collections

    {
        $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "userId",
            as: "orders"
        }
    }
8️⃣ $unwind → Flatten array fields

    { $unwind: "$orders" }
9️⃣ $addFields → Add new dynamic fields

    { 
        $addFields: { 
            fullName: { $concat: ["$firstName", " ", "$lastName"] } 
        } 
    }

🔟 $replaceRoot → Replace document with nested document
    {
        $replaceRoot: { newRoot: "$address" }
    }

1️⃣1️⃣ $facet → Multiple pipelines in a single query (best for pagination + filtering)
    {
        $facet: {
            data: [
            { $skip: 10 },
            { $limit: 5 }
            ],
            totalCount: [
            { $count: "count" }
            ]
        }
    }

1️⃣2️⃣ $count → Count documents
    { $count: "totalUsers" }

1️⃣3️⃣ $sample → Get random documents
    { $sample: { size: 3 } }

1️⃣4️⃣ $set → Add or update fields (same as $addFields)
    { $set: { createdYear: { $year: "$createdAt" } } }

1️⃣5️⃣ $unset → Remove fields
    { $unset: ["password", "token"] }

1️⃣6️⃣ $expr → Use variables in queries
    { 
        $match: { 
            $expr: { $gt: ["$salary", "$bonus"] } 
        } 
    }

1️⃣7️⃣ $bucket → Group values into ranges
    {
        $bucket: {
            groupBy: "$age",
            boundaries: [0, 18, 30, 50, 100],
            default: "Other",
            output: { count: { $sum: 1 } }
        }
    }

1️⃣8️⃣ $bucketAuto → Auto bucket ranges
    {
        $bucketAuto: {
            groupBy: "$age",
            buckets: 4
        }
    }

1️⃣9️⃣ $sortByCount → Group + Count in one step
    { $sortByCount: "$lastName" }

2️⃣0️⃣ $geoNear → Geo (location) search
    {
        $geoNear: {
            near: { type: "Point", coordinates: [72.88, 19.07] },
            distanceField: "distance",
            spherical: true
        }
    }

1) Comparison operators in MongoDB in Hindi ( $eq, $ne, $lt, $gt, $lte, $gte, $in & $nin )
    In MongoDB, comparison operators are used to compare values in query expressions and to filter documents based on the comparison results. Here is a list of some of the comparison operators available in MongoDB:

    $eq: This operator tests for equality and returns true if the operands are equal.

    $ne: This operator tests for inequality and returns true if the operands are not equal.

    $gt: This operator tests for greater than and returns true if the left operand is greater than the right operand.

    $gte: This operator tests for greater than or equal to and returns true if the left operand is greater than or equal to the right operand.

    $lt: This operator tests for less than and returns true if the left operand is less than the right operand.

    $lte: This operator tests for less than or equal to and returns true if the left operand is less than or equal to the right operand.
2) Logical Operators in MongoDB in Hindi ( $not, $and, $or & $nor)
            In MongoDB, logical operators are used to combine multiple expressions in a query or to perform logical operations on individual expressions.

        $and: This operator performs a logical AND operation on an array of expressions and returns true if all the expressions are true.

        $or: This operator performs a logical OR operation on an array of expressions and returns true if at least one of the expressions is true.

        $not: This operator performs a logical NOT operation on a single expression and returns true if the expression is false and false if the expression is true.                                                                                                                                                        
3) Mastering MongoDB: Understanding the $exists and $type Operators

            Here's an example of how you might use the $exists operator in a find() method:
        ```db.collection.find({ field: { $exists: true } })```

        This would retrieve all documents from the collection where the field exists. You can also use $exists: false to retrieve documents where the field does not exist.


        ```db.collection.find({ field: { $exists: true, $in: [value1, value2, value3] } })```

        This would retrieve all documents from the collection where the field exists and has a value of value1, value2, or value3.

        ```db.collection.find({ field: { $type: typeCode } })```

        This would retrieve all documents from the collection where the field has the data type specified by typeCode.

        Here are some examples of type codes that you can use with the $type operator:

        1 - double
        2 - string
        3 - object
        4 - array
        5 - binary data
        6 - undefined (deprecated)
        7 - object id
        8 - boolean
        9 - date
        10 - null
        11 - regular expression
        13 - javascript
        14 - symbol
        15 - javascript (with scope)
        16 - 32-bit integer
        17 - timestamp
        18 - 64-bit integer

4) Take Your MongoDB Queries to the Next Level with Evaluation Operators

    $expr is a MongoDB operator that allows you to use JavaScript expressions to perform queries on the database.

    $regex is a MongoDB operator that allows you to use regular expressions to perform queries on the database.

    $mod is a MongoDB operator that allows you to use modulo arithmetic in queries.

    $text is a MongoDB operator that allows you to perform full-text searches on the database.

    $jsonSchema is a MongoDB operator that allows you to validate the structure and content of documents in a collection based on a provided JSON schema.

5) Advanced Update ( $inc, $min, $max, $mul, $unset, $rename & Upsert in MongoDB )

    $inc: The $inc operator increments the value of a field by a specified amount.

    $min: The $min operator updates the value of a field if the specified value is less than the current value of the field.

    $max: The $max operator updates the value of a field if the specified value is greater than the current value of the field.

    $mul: The $mul operator multiplies the value of a field by a specified amount.

    $unset: The $unset operator removes a specific field from a document.

    $rename: The $rename operator renames a field.

    Upsert: An upsert is a combination of an update and an insert operation. If a document matching the update criteria does not exist, the update operation creates a new document with the specified update criteria. If a document matching the update criteria does exist, the update operation modifies the existing document.

6) MongoDB - Update Nested Arrays and Use $pop, $pull, $push and $addToSet Operators.

    To update a nested array in MongoDB, you can use the $ operator to specify the position of the element in the array and the $set operator to specify the new value for that element

    $push is an operator in MongoDB that is used to add an item or items to an array within a document.

    $pull is used to remove an item or items from an array that match a specified condition.

    $pop is used to remove the first or last item from an array.

    $addToSet is used to add an item to an array only if it does not already exist in the set. These operators are useful for modifying array values in a MongoDB document without overwriting the entire array.