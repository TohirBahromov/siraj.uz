@AGENTS.md

Uploading images should be saved in its related folder: product -> /uploads/products, staff -> /uploads/staff, videos -> /uploads/videos, .etc

Whenever you create a static text, don't hardcode it, localize it first to all the locals available in the project, and use it from dictionary. Similarly, whenever you create a dynamic text content in any new table, create translations table of it with all the locals available.

Whenever you need to list products, list then in cursor based pagination where "load more" button should load more products while keeping the previous pages. 10 items per page.
