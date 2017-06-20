var Masto = require('mastodon-api')
const M = new Masto({
	access_token: process.env.access_token,
	timeout_ms: 60 * 1000,
	api_url: 'https://' + process.env.api_url + '/api/v1/',
})
const MESSAGE = "\r\n動くな、Mastodon警察だ。壁に手をつけ。いまお前が使ったリンクはt.coだな…？"
function post(id, reply_id) {
	console.log({ status: "@" + id + MESSAGE, in_reply_to_id: reply_id });
	M.post('statuses', { status: "@" + id + MESSAGE, in_reply_to_id: reply_id }, function (err, a, b) {
		console.log(JSON.stringify(err, null, "\t"));
	})
}

const streamPub = M.stream('streaming/public') // streaming/public でやったら死ぬかも

streamPub.on('message', (msg) => {
	if (msg.event == 'update' && msg.data.content.match(/.https:\/\/t\.co./)) {
		post(msg.data.account.acct, msg.data.id);
	}
})

streamPub.on('error', (err) => {
	console.log(err)
})