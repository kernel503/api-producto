<template>
  <v-container>
    <v-row>
      <template v-for="producto in productos">
        <v-col cols="12" sm="6" md="4" :key="producto.id">
          <v-card class="mx-auto my-12" max-width="374">
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>

            <v-img height="250" :src="producto.img_url"></v-img>

            <v-card-title>{{ producto.nombre }}</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0">
                <v-rating
                  :value="4.5"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                ></v-rating>

                <div class="grey--text ms-4">
                  4.5 (413)
                </div>
              </v-row>

              <div class="my-4 text-subtitle-1">
                {{ producto.grupo_inventario }}
              </div>

              <div v-if="producto.descripcion">
                {{ producto.descripcion }}
              </div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>
            <v-card-title>
              {{
                producto.opciones.length
                  ? 'Opciones disponibles'
                  : 'Sin opciones'
              }}
            </v-card-title>
            <v-card-text v-if="producto.opciones.length">
              <v-chip-group
                active-class="deep-purple accent-4 white--text"
                column
              >
                <template v-for="opcion in producto.opciones">
                  <v-chip :key="opcion.id">{{ opcion.detalle }}</v-chip>
                </template>
              </v-chip-group>
            </v-card-text>
            <v-card-actions>
              <v-btn color="deep-purple lighten-2" text>
                Solicitar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ProductoDisponible',
  data: () => ({
    productos: []
  }),

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      window.axios
        .get('productos')
        .then(response => (this.productos = response?.data?.data || []))
        .catch(error => {
          console.error(error)
          this.productos = []
        })
    }
  }
}
</script>
