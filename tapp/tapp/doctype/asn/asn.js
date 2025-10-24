// Copyright (c) 2025, supriya and contributors
// For license information, please see license.txt


// Parent Doctype: ASN
frappe.ui.form.on('ASN', {
    refresh(frm) {
        //console.log("ASN form refreshed");
        update_packing_dropdown(frm);
    }
});


// Child Table: PO Details
frappe.ui.form.on('PO Details', {
    item_code(frm, cdt, cdn) {
        //console.log("PO Details item_code changed");
        update_packing_dropdown(frm);
    },
    item_name(frm, cdt, cdn) {
        update_packing_dropdown(frm);
    },
    po_details_add(frm) {
        update_packing_dropdown(frm);
    },
    po_details_remove(frm) {
        update_packing_dropdown(frm);
    }
});


// Child Table: Packing Details
frappe.ui.form.on('Packing Details', {
    item_code(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        //console.log("Selected Item Code:", row.item_code);

        let po_rows = frm.fields_dict['po_details'].grid.get_data();
        //console.log("PO Rows:", po_rows);

        let item = po_rows.find(d => d.item_code === row.item_code);
        if (item) {
            frappe.model.set_value(cdt, cdn, 'item_name', item.item_name);
            console.log("Fetched Item Name:", item.item_name);
        } else {
            frappe.model.set_value(cdt, cdn, 'item_name', '');
            console.log("No matching Item Code found");
        }
    }
});


// Function to update dropdown in Packing Details
function update_packing_dropdown(frm) {
    let po_rows = frm.fields_dict['po_details'].grid.get_data();
    //console.log("Checking PO Details rows:", po_rows);

    if (!po_rows || po_rows.length === 0) {
        //console.log(" No PO Details found yet");
        return;
    }

    let unique_codes = [...new Set(po_rows.map(r => r.item_code).filter(x => x))];
    //console.log(" Unique Codes:", unique_codes);

    if (frm.fields_dict['packing_details']) {
        frm.fields_dict['packing_details'].grid.update_docfield_property(
            'item_code',
            'options',
            unique_codes.join('\n')
        );
        frm.fields_dict['packing_details'].grid.refresh();
        
    }
}


