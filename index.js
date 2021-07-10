const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let data = []
for (let i = 1; i <= 200; i++) {
    data.push({
        _id: Math.random().toString(),
        email: `user${i}@neolab.vn`,
        avatar: `Avatar ${i}`,
        firstName: `First Name ${i}`,
        lastName: `Last Name ${i}`,
        groupRoleIds: ['1', '2'],
        roleIds: ['1'],
        status: 'ACTIVE',
        isDeleted: false,
        createdBy: 'teo.nguyen@neolab.vn',
        updatedBy: 'teo.nguyen@neolab.vn',
        updatedAt: new Date(),
        createdAt: new Date()
    })
}
data.reverse();

app.get('/api/users', (req, res) => {
    const {query} = req;
    const {current = 1, pageSize = 20, sort, ...filter} = query || {};
    let newData = [...data];
    newData = newData.filter(it => {
        const a = !Object.keys(filter).some(key => (it[key] || '').indexOf(filter[key]) === -1)
        return a;
    })
    const result = {
        data: newData.slice((current - 1) * pageSize, current * pageSize),
        total: newData.length, success: true, pageSize: +pageSize, current: +current
    }
    res.json(result);
})

app.get('/api/users/:id', (req, res) => {
    const {params} = req;
    const {id} = params || {};
    const user = data.find(it => it._id === id)
    res.json({
        data: user,
        success: true
    });
})

app.post('/api/users', (req, res) => {
    let { body } = req;
    body = {
        ...body,
        _id: Math.random().toString(),
        groupRoleIds: [2],
        roleIds: [2],
        createdBy: 'teo.nguyen@neolab.vn',
        updatedBy: 'teo.nguyen@neolab.vn',
        updatedAt: new Date(),
        createdAt: new Date()
    }
    data.unshift(body)
    res.json({
        data: body,
        success: true
    });
})

app.put('/api/users/:id', (req, res) => {
    const { body, params } = req;
    let user = data.find(it => it._id === params.id);
    if (!user) return res.json({success: false})
    Object.keys(body).forEach(key => {
        user[key] = body[key];
    })
    res.json({
        data: user,
        success: true
    });
})

app.delete('/api/users/:id', (req, res) => {
    const { body, params } = req;
   data = data.filter(it => it._id !== params.id);
    res.json({
        success: true
    });
})

app.listen(999, () => {
    console.log('Mock api start at port 999');
})
