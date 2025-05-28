Table Usuarios {
  id varchar [pk]
  nombre varchar [not null]
  saldo float [default: 0]
  createdAt datetime [default: `CURRENT_TIMESTAMP`]
  updatedAt datetime [default: `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`]
}

Table Memes {
  id varchar [pk]
  nombre varchar [not null]
  imagen varchar
  categoria varchar
  rareza enum('popular', 'raro', 'nuevo')
  createdAt datetime [default: `CURRENT_TIMESTAMP`]
  updatedAt datetime [default: `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`]
}

Table PreciosMemes {
  id int [pk, increment]
  memeId varchar
  precio float [not null]
  timestamp datetime [default: `CURRENT_TIMESTAMP`]
}

Table Operaciones {
  id int [pk, increment]
  userId varchar
  memeId varchar
  tipo enum('compra', 'venta') [not null]
  precio float [not null]
  cantidad int [default: 1]
  createdAt datetime [default: `CURRENT_TIMESTAMP`]
}

Table TrendingMemes {
  id int [pk, increment]
  memeId varchar
  score int [not null]
  timestamp datetime [default: `CURRENT_TIMESTAMP`]
}

// Relationships
Ref: Precios_Memes.memeId > Memes.id
Ref: Operaciones.userId > Usuarios.id
Ref: Operaciones.memeId > Memes.id
Ref: Trending_Memes.memeId > Memes.id
