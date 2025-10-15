// Copyright (c) 2025, supriya and contributors
// For license information, please see license.txt
// Copyright (c) 2025, supriya and contributors
// For license information, please see license.txt

frappe.ui.form.on('Po So Link list', {
    onload: function(frm) {
        // Hide the child table on the form
        frm.set_df_property('po_so_items', 'hidden', 1);
    },

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
    },

    //handles your "Fetch" button click
    fetch_items: function(frm) {
        if (!frm.doc.po_so_items || frm.doc.po_so_items.length === 0) {
            frappe.msgprint(__('No items found. Please select a Sales Order first.'));
            return;
        }

        // Create a dialog to display the existing child table data
        let d = new frappe.ui.Dialog({
            title: 'Fetched Sales Order Items',
            size: 'extra-large',
            fields: [
                {
                    fieldname: 'so_items_table',
                    fieldtype: 'Table',
                    label: 'Sales Order Items',
                    cannot_add_rows: true,
                    read_only: 1,
                    fields: [
                        { fieldtype: 'Data', fieldname: 'item_code', label: 'Item Code', in_list_view: 1 },
                        { fieldtype: 'Data', fieldname: 'description', label: 'Description', in_list_view: 1 },
                        { fieldtype: 'Float', fieldname: 'qty', label: 'Qty', in_list_view: 1 },
                        { fieldtype: 'Currency', fieldname: 'rate', label: 'Rate', in_list_view: 1 },
                    ]
                }
            ]
        });

        // Fill dialog table with the existing items from child table
        d.fields_dict.so_items_table.df.data = frm.doc.po_so_items;
        d.fields_dict.so_items_table.grid.refresh();

        // Show dialog
        d.show();
    }
});

