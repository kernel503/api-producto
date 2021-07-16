<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>App</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn to="productos" small class="mx-2" color="indigo" dark>
        Listado Productos
      </v-btn>

      <v-btn to="gestionar" small class="mx-2" color="red" dark>
        Gestionar Producto
      </v-btn>

      <v-btn to="gestionar-detalle" small class="mx-2" color="red" dark>
        Gestionar Detalle
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
