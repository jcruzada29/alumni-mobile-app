/* eslint-disable radix */
import _ from 'lodash';
import moment from 'moment';

const TicketPriceHelper = {
	getTotalPrice ({ tickets, event_price_groups, event }){
		// no. of ticket
		const noOfTicket = tickets.filter((ticket) => !_.isNil(ticket.user_type_value)).length;
		const isEarlyBird = this.isEarlyBird(event);
		const isAlumniOnly = noOfTicket === 1;
		const prices = [];
		if (event_price_groups.length > 0){
			tickets.map(ticket => {
				const { user_type_value } = ticket;
				if (user_type_value) {
					const { id: user_type_id } = user_type_value;
					const price_group_price = this.getPriceGroup({ noOfTicket, isAlumniOnly, event_price_groups, user_type_id, isEarlyBird });
					if (price_group_price) {
						prices.push({ price_group_price });
					}
				}
				return ticket;
			});
		}
		return prices;
		// console.log({ isEarlyBird });
	},
	getPriceGroup({ noOfTicket, isAlumniOnly, event_price_groups, user_type_id, isEarlyBird }){
		let price_group_price = null;
		if (isEarlyBird) {
			// identify if there is only 1 ticket/ for alumni only.
			if (isAlumniOnly) {
				const event_price_group = event_price_groups.find(group => group.type === 'early_bird');
				if (event_price_group) {
					if(noOfTicket < event_price_group.min_person) {
						price_group_price = null;
					} else {
						price_group_price = event_price_group.event_price_group_price.find(price => price.event_ut_id === user_type_id);
					}
				}
			} else {
				// more than 1 ticket.
				const event_price_group_filtered = event_price_groups.filter(group => group.type === 'early_bird');
				const event_price_group = event_price_group_filtered.reduce((prev, curr) => ( noOfTicket >= curr.min_person ? curr : prev) );
				if (event_price_group) {
					if(noOfTicket < event_price_group.min_person) {
						price_group_price = null;
					} else {
						price_group_price = event_price_group.event_price_group_price.find(price => price.event_ut_id === user_type_id);
					}
				}
			}
			return price_group_price;
		} 
		// standard
		// identify if there is only 1 ticket/ for alumni only.
		if (isAlumniOnly) {
			const event_price_group = event_price_groups.find(group => group.type === 'standard');
			if (event_price_group) {
				if(noOfTicket < event_price_group.min_person) {
					price_group_price = null;
				} else {
					price_group_price = event_price_group.event_price_group_price.find(price => price.event_ut_id === user_type_id);
				}
			}
		} else {
			// more than 1 ticket.
			const event_price_group_filtered = event_price_groups.filter(group => group.type === 'standard');
			const event_price_group = event_price_group_filtered.reduce((prev, curr) => ( noOfTicket >= curr.min_person ? curr : prev) );
			if (event_price_group) {
				if(noOfTicket < event_price_group.min_person) {
					price_group_price = null;
				} else {
					price_group_price = event_price_group.event_price_group_price.find(price => price.event_ut_id === user_type_id);
				}
			}
		}
		return price_group_price;

	},
	isEarlyBird(event) {
		const { early_start_date, early_end_date } = event;
		const startDate = moment(early_start_date);
		const endDate = moment(early_end_date);
		
		return moment().isBetween(startDate, endDate);
	}
};

export default TicketPriceHelper;