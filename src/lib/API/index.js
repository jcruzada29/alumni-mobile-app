import auth from './auth';
import onboarding_screens from './onboarding_screens';
import assets from './assets';
import news from './news';
import donations from './donations';
import events from './events';
import saving_coupons from './saving_coupons';
import alumni_offers from './alumni_offers';
import campus_offers from './campus_offers';
import highlights from './highlights';
import parking_privileges from './parking_privileges';
import transit_schedules from './transit_schedules';
import users from './users';
import staticApi from './static';
import event_pricing_groups from './event_price_groups';
import jobs from './jobs';
import fbs from './fbs';
import notifications from './notifications';
import settings from './settings';
import payment_methods from './payment_methods';
import transactions from './transactions';
import popups from './popups';
import subscriptions from './subscriptions';
import push_notification_settings from './push_notification_settings';
import sis from './sis';
import event_registrations from './event_registrations';

export default {
	auth,
	assets,
	onboarding_screens,
	news,
	donations,
	events,
	saving_coupons,
	alumni_offers,
	campus_offers,
	highlights,
	parking_privileges,
	transit_schedules,
	users,
	static: staticApi,
	event_pricing_groups,
	jobs,
	fbs,
	notifications,
	settings,
	payment_methods,
	transactions,
	popups,
	subscriptions,
	push_notification_settings,
	sis,
	event_registrations
};
