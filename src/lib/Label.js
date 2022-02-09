export default {
	registrationStatus: (status) => {
		switch(status) {
			case 'pending':
				return 'Pending';
			case 'confirmed':
				return 'Confirmed';
			case 'cancelled':
				return 'Cancelled';
			case 'waiting_list':
				return 'Waiting List';
			default:
		}
		return '';
	},
	registrationPaymentStatus: (status) => {
		switch(status) {
			case 'pending':
				return 'Pending';
			case 'paid':
				return 'Paid';
			case 'waived':
				return 'Waived';
			case 'cancelled':
				return 'Cancelled';
			default:
		}
		return '';
	}
};