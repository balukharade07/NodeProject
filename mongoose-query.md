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