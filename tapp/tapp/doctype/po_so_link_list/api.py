import frappe

from .utils import get_sales_orders_from_po  as _get_sales_orders_from_po, get_so_items as _get_so_items 

#Query to fetch Sales Orders based on the selected Purchase Order
@frappe.whitelist()
def get_sales_orders_from_po(doctype,txt,searchfield,start,page_len,filters):
    return _get_sales_orders_from_po(doctype,txt,searchfield,start,page_len,filters)

#fetch the sales order child table into po so file.
@frappe.whitelist()
def get_so_items(sales_order=None):
    return _get_so_items(sales_order)
