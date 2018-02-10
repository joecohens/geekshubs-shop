# GeeksHubs Shop

Los endpoints disponibles son:

```
GET /products
GET /products/:id
POST /products/:id
PUT /products/:id
DELETE /products/:id
```

```
GET /carts
GET /carts/:id
POST /carts
  {
    "id": $cartId // si no tiene cart id o no existe crea uno nuevo
    "product_id": $productID
    "quantity": 1
  }
PUT /carts
  {
    "id": $itemId
    "quantity": 1
  }
DELETE /carts
  {
    "id": $itemId
  }
```
