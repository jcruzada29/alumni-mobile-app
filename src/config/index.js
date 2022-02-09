// world
const local = require('./environment/local');
const prod = require('./environment/prod');
const dev = require('./environment/dev');
const uat = require('./environment/uat');
const sit = require('./environment/sit');
const testing = require('./environment/testing');
const testing2 = require('./environment/testing2');
// cn
const local_cn = require('./environment/local_cn');
const prod_cn = require('./environment/prod_cn');
const dev_cn = require('./environment/dev_cn');
const uat_cn = require('./environment/uat_cn');
const sit_cn = require('./environment/sit_cn');
const testing_cn = require('./environment/testing_cn');
const testing2_cn = require('./environment/testing2_cn');


const configs = {
	// world
	local,
	dev,
	uat,
	sit,
	prod,
	testing,
	testing2,
	// cn
	local_cn,
	dev_cn,
	uat_cn,
	sit_cn,
	prod_cn,
	testing_cn,
	testing2_cn
};
// module.exports = configs.local;
// module.exports = configs.local_cn;
// module.exports = configs.uat;
// module.exports = configs.uat_cn;
module.exports = configs.prod;
// module.exports = configs.prod_cn;
// module.exports = configs.testing;
// module.exports = configs.testing_cn;
