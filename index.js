import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: '*',
  },
});

let onlineAccounts = [];

const addNewAccount = (accountId, socketId) => {
	!onlineAccounts.some((account) => account.accountId === accountId) &&
	onlineAccounts.push({ accountId, socketId });
	console.log("new account: " + socketId);
};

const removeAccount = (socketId) => {
  	onlineAccounts = onlineAccounts.filter((user) => user.socketId !== socketId);
	  console.log("remove account: " + socketId);
};

const getAccount = (accountId) => {
	return onlineAccounts.find((account) => account.accountId === accountId);
};

io.on("connection", (socket) => {
	socket.on("newAccount", (accountId) => {
		addNewAccount(accountId, socket.id);
	});

  	socket.on("disconnect", () => {
		removeAccount(socket.id);
	});

	socket.on("sendNotification", ({ accountId, product, type }) => {
		const receiver = getAccount(accountId);
		io.to(receiver.socketId).emit("getNotification", {
			product,
			type
		});
	});
});

io.listen(5002);
