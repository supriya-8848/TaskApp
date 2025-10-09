// Copyright (c) 2025, supriya and contributors
// For license information, please see license.txt

//User can select date field for only the 15th date or the Last-date.
frappe.ui.form.on('Date Filtering',{
   date(frm){
    let d=frm.doc.date;

    if(d){
        const dateObj = frappe.datetime.str_to_obj(d);
        const day = dateObj.getDate();
        const last = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1,0).getDate();

        if (day !== 15 && day !== last){
            frappe.msgprint({
                title: __("Invalid Date"),
                message: __("Please select either the 15th or the last day of the month."),
                indicator: "red"
            });
            frm.set_value("date",null);
            }
        }
    },
});

//Child Table Date-field filtering.
frappe.ui.form.on("Date filter child table",{
    date(frm, cdt, cdn){
        //console.log("✅ Child date changed!", cdt, cdn);
        const row= locals[cdt][cdn];
        const d = row.date;

        if(d){
            const dateObj = frappe.datetime.str_to_obj(d);
            const day = dateObj.getDate();
            const last = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();

            if(day !== 15 && day !== last){
                frappe.msgprint({
                    title: __("Invalid Date"),
                    message: __("Please select either the 15th or the last day of the month."),
                    indicator: "red"
                });

                frappe.model.set_value(cdt, cdn, "date", null)
            }

        }
    }
});
