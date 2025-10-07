// Copyright (c) 2025, supriya and contributors
// For license information, please see license.txt
frappe.ui.form.on('Po So Link list', {
    purchase_order: function(frm) {
        if (frm.doc.purchase_order) {
            frm.set_query("sales_order", function() {
                return {
                    query: "tapp.tapp.doctype.po_so_link_list.api.get_sales_orders_from_po",
                    filters: {
                        purchase_order: frm.doc.purchase_order
                    }
                };
            });
        }
    },

    sales_order: function(frm) {
        if (!frm.doc.sales_order) return;

        // Clear existing child table rows
        frm.clear_table('po_so_items');

        // Fetch child items from the selected SO
        frappe.call({
            method: "tapp.tapp.doctype.po_so_link_list.api.get_so_items",
            args: {
                sales_order: frm.doc.sales_order
            },
            callback: function(r) {
                if (r.message) {
                    r.message.forEach(function(item) {
                        let row = frm.add_child('po_so_items');
                        row.item_code = item.item_code;
                        row.description = item.description;
                        row.qty = item.qty;
                        row.rate = item.rate;
                    });
                    frm.refresh_field('po_so_items');
                }
            }
        });
    }
});
