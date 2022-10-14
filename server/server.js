const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' },
  pingInterval: 5000,
  pingTimeout: 10000,
});
const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/tables', async (req, res) => {
  const tables = await prisma.table.findMany();

  res.status(200).json(tables);
});

app.get('/login/:tid(\\d+)/:sid', async (req, res) => {
  const tid = Number(req.params.tid);
  const sid = req.params.sid;

  try {
    const stored_sid = await prisma.table.findUnique({
      where: { id: tid },
      select: {
        sessionID: true,
      },
    });

    if (stored_sid.sessionID === sid) {
      return res.status(200).json({ code: 200 });
    }

    res.status(401).json({ code: 401 });
  } catch (err) {
    res.json(err.message);
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    res.status(200).json(categories);
  } catch (err) {
    res.status(404).json(err.message);
  }
});

app.get('/products/:cid(\\d+)', async (req, res) => {
  const cid = Number(req.params.cid);
  try {
    const products = await prisma.product.findMany({
      where: { category_id: cid },
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(404).json(err.message);
  }
});

app.get('/orders', async (req, res) => {
  const allOrders = await prisma.order.findMany({
    include: { Product: true },
  });
  res.status(200).json(allOrders);
});

app.get('/orders/:tid(\\d+)', async (req, res) => {
  const tid = Number(req.params.tid);
  const tableOrders = await prisma.order.findMany({
    where: { table: tid },
    include: { Product: true },
  });
  res.status(200).json(tableOrders);
});

app.post('/orders/:tid(\\d+)/:sid', async (req, res) => {
  const tid = Number(req.params.tid);
  const sid = req.params.sid;
  const orders = req.body;

  try {
    const stored_sid = await prisma.table.findUnique({
      where: { id: tid },
      select: {
        sessionID: true,
      },
    });

    if (stored_sid.sessionID === sid) {
      console.log(orders);
      orders.forEach(async (order) => {
        await prisma.order.create({
          data: {
            table: tid,
            sessionID: sid,
            plates_id: order.product.id,
            quantity: order.quantity,
          },
        });
      });
      return res.status(200).json({ code: 200 });
    }
  } catch {}
});

app.delete('/orders/:tid(\\d+)/:sid/:oid(\\d+)', async (req, res) => {
  const tid = Number(req.params.tid);
  const sid = req.params.sid;
  const oid = Number(req.params.oid);

  try {
    const stored_sid = await prisma.table.findUnique({
      where: { id: tid },
      select: {
        sessionID: true,
      },
    });

    if (stored_sid.sessionID === sid) {
      try {
        await prisma.order.delete({ where: { id: oid } });
        return res.status(200);
      } catch (err) {
        res.status(404).json({ msg: err.message });
      }
    }
    res.status(404).json({ msg: 'Not found' });
  } catch (err) {}
});

app.patch('/orders/:oid(\\d+)/:status', async (req, res) => {
  const oid = Number(req.params.oid);
  const newStatus = req.params.status;

  try {
    await prisma.order.update({
      where: { id: oid },
      data: { status: newStatus },
    });
    res.status(200).json({ msg: 'ok' });
  } catch (err) {
    res.status(404).json({ msg: 'Not exist' });
  }
});

app.patch('/reserve/:id(\\d+)', async (req, res) => {
  const tableNo = Number(req.params.id);
  const sid = randomUUID();
  try {
    const reservedTable = await prisma.table.update({
      where: { id: tableNo },
      data: { sessionID: sid, reserved: true },
    });

    res.status(200).json(reservedTable);
  } catch {
    res.status(401);
    res.json({ message: 'nope' });
    console.log(err.message);
  }
});

app.patch('/unreserve/:id(\\d+)', async (req, res) => {
  const tableNo = Number(req.params.id);
  const reservedTable = await prisma.table.update({
    where: { id: tableNo },
    data: { sessionID: null, reserved: false },
  });

  res.status(200).json(reservedTable);
});

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  // const arr = Array.from(io.sockets.adapter.rooms);
  // console.log(arr);

  socket.on('disconnect', (reason) => {
    console.log(`${socket.id} disconnected ${reason}`);
  });
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined in ${room}`);
    socket.emit('update_orders');
  });
  socket.on('send_orders', (room) => {
    socket.broadcast.emit('new_orders');
    socket.to(room).emit('update_orders');
  });
  socket.on('refresh_all', () => {
    console.log('all refresh');
    socket.broadcast.emit('update_orders');
  });

  // socket.on('send_message', (msg) => {
  //   console.log('message: ' + msg.message);
  // });
});
//app.listen(3000);
server.listen(3000);
