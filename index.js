let io = require('socket.io-client')

const BASE_URL = 'wss://api-v4.zerion.io/';

const addressSocket = {
    namespace: 'address',
    socket: io.connect(`${BASE_URL}address`, {
        transports: ['websocket'],
        timeout: 60000,
        query: {
            api_token:
                'Demo.ukEVQp6L5vfgxcz4sBke7XvS873GMYHy',
        },
    }),
};

function subscribe(socketNamespace, requestBody) {
    const { socket, namespace } = socketNamespace;
    function handleReceive(data) {
        console.log(data)
    }
    const model = requestBody.scope[0];
    function unsubscribe() {
        socket.off(`received ${namespace} ${model}`, handleReceive);
        socket.emit('unsubscribe', requestBody);
    }

    socket.on("connect", (data)=>{
        socket.emit('subscribe', requestBody);
    })

    socket.on(`received ${namespace} ${model}`, (msg)=>{
        console.log(msg) //only logs once
    });

}

subscribe(addressSocket, {
    scope: ['transactions'],
    payload: {
        address: '0xf6da21E95D74767009acCB145b96897aC3630BaD' ,//0xFF83bf139262CDA86080d2ed327A6eD796462491
        currency: 'usd',
        portfolio_fields: 'all'
    },
})
