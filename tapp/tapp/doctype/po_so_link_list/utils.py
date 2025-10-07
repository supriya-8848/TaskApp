import frappe
from frappe import _

#Query to fetch Sales Orders based on the selected Purchase Order
def get_sales_orders_from_po(doctype,txt,searchfield,start,page_len,filters):
    purchase_order = filters.get("purchase_order")

    if not purchase_order:
        return []

    return frappe.db.sql("""
    SELECT DISTINCT poi.sales_order, so.customer
    FROM `tabPurchase Order Item` poi
    LEFT JOIN `tabSales Order` so ON so.name = poi.sales_order
    WHERE poi.parent = %s AND poi.sales_order IS NOT NULL
    LIMIT %s OFFSET %s
    """, (purchase_order, page_len, start))

#fetch the sales order child table into po so file.
def get_so_items(sales_order=None):
    if not sales_order:
        frappe.msgprint("No Sales Order provided.")
        return []
    
    items = frappe.get_all(
        "Sales Order Item",
        filters={"parent": sales_order},
        fields=["item_code", "description", "qty", "delivery_date", "rate", "amount"]
    )
    return items
