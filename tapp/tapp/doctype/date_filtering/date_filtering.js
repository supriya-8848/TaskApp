// Copyright (c) 2025, supriya and contributors
// For license information, please see license.txt

//Parent Validation
frappe.ui.form.on('Date Filtering', {
    refresh(frm) {
        // Restrict parent 'date' field to 15th & last day, not today
        if (frm.fields_dict["date"]?.datepicker) {
            frm.fields_dict["date"].datepicker.update({
                onRenderCell: function(date, cellType) {
                    if (cellType === 'day') {
                        const dayOfMonth = date.getDate();
                        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                        const isAllowed = (dayOfMonth === 15) || (dayOfMonth === lastDayOfMonth);
                        const today = new Date();

                        if (!isAllowed || date.toDateString() === today.toDateString()) {
                            return { disabled: true };
                        }
                    }
                }
            });
        }
    },
});

//child Table Validation
frappe.ui.form.on('Date filter child table', {
    date: function(frm, cdt, cdn) {
        let child_doc = locals[cdt][cdn];
        if (child_doc.date) {
            const dt = frappe.datetime.str_to_obj(child_doc.date);
            const day = dt.getDate();
            const lastDay = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
            if (!(day === 15 || day === lastDay)) {
                frappe.msgprint({
                    title: __('Invalid Date'),
                    message: __('Date must be either the 15th or the last day of the month.'),
                    indicator: 'red'
                });
                frappe.validated = false;
                // Clear the invalid date
                frappe.model.set_value(cdt, cdn, 'date', '');
            }
        }
    },
});