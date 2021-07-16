<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="detalleProducto"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>CRUD Detalle Producto</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Agregar Detalle del Producto
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-autocomplete
                          clearable
                          v-model="editedItem.producto_id"
                          :items="productosBase"
                          label="Producto asociado"
                          item-text="nombre"
                          item-value="producto_id"
                          :rules="campoTexto"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.detalle"
                          label="Información del producto"
                          :rules="campoTexto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.precio_unitario"
                          label="Precio Unitario"
                          :rules="campoNumerico"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.cantidad_disponible"
                          label="Cantidad Disponible"
                          :rules="campoNumerico"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.ubicacion"
                          label="Ubicación"
                          :rules="campoTexto"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >¿Desea eliminar el registro?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editItem(item)" color="indigo">
          mdi-pencil
        </v-icon>
        <v-icon @click="deleteItem(item)" color="red">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" timeout="2500" :color="color">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'DetalleProducto',
  data: () => ({
    campoTexto: [v => !!v || 'Debe rellenar el campo'],
    campoNumerico: [v => !!+v || 'Debe ingresar solo digitos'],
    valid: true,
    dialog: false,
    snackbar: false,
    text: '',
    color: '',
    dialogDelete: false,
    headers: [
      { text: 'Producto asociado', value: 'nombre', align: 'start' },
      { text: 'Grupo Inventario', value: 'grupo_inventario', align: 'start' },
      {
        text: 'Detalle',
        sortable: false,
        value: 'detalle'
      },
      { text: 'Precio Unitario', value: 'precio_unitario' },
      {
        text: 'Cantidad disponible',
        value: 'cantidad_disponible',
        sortable: false,
        align: 'center'
      },
      {
        text: 'Valor de mercancia',
        value: 'valor_neto',
        sortable: false,
        align: 'center'
      },
      { text: 'Ubicación', value: 'ubicacion', sortable: false, align: 'end' },
      {
        text: 'Cantidad disponible',
        value: 'actions',
        sortable: false,
        align: 'center'
      }
    ],
    detalleProducto: [],
    productosBase: [],
    editedIndex: -1,
    editedItem: {
      producto_id: null,
      detalle: '',
      precio_unitario: '',
      cantidad_disponible: '',
      ubicacion: ''
    },
    defaultItem: {
      producto_id: null,
      detalle: '',
      precio_unitario: '',
      cantidad_disponible: '',
      ubicacion: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Agregar Producto' : 'Editar Producto'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      window.axios
        .get('productos')
        .then(response => {
          const detalleResponse = response?.data?.data || []
          const productoDetalle = []
          detalleResponse.forEach(element => {
            const { grupo_inventario, id, nombre } = element
            element.opciones.forEach(detalle => {
              productoDetalle.push({
                producto_id: id,
                grupo_inventario,
                nombre,
                ...detalle
              })
            })
            this.productosBase.push({ producto_id: id, nombre })
          })
          this.detalleProducto = productoDetalle
        })
        .catch(error => {
          console.error(error)
          this.detalleProducto = []
        })
    },

    editItem (item) {
      this.editedIndex = this.detalleProducto.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.detalleProducto.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      const id = this.detalleProducto[this.editedIndex].id
      window.axios
        .delete('producto/detalle/eliminar', { data: { id } })
        .then(response => {
          console.log(response.data.message)
          this.notificacion(response.data.message)
          this.initialize()
        })
        .catch(error => {
          console.error(error)
          this.detalleProducto = []
        })
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$refs.form.reset()
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (!this.$refs.form.validate()) {
        this.notificacion('Revisar los campos', 'red')
        return
      }
      if (this.editedIndex > -1) {
        window.axios
          .put('producto/detalle/actualizar', this.editedItem)
          .then(response => {
            console.log(response.data.message)
            this.notificacion(response.data.message)
            this.initialize()
          })
          .catch(error => {
            console.error(error)
            this.detalleProducto = []
          })
      } else {
        window.axios
          .post('producto/detalle/crear', this.editedItem)
          .then(response => {
            console.log(response.data.message)
            this.notificacion(response.data.message)
            this.initialize()
          })
          .catch(error => {
            console.error(error)
            this.detalleProducto = []
          })
      }
      this.close()
    },

    notificacion (text, color = 'indigo') {
      this.snackbar = true
      this.text = text
      this.color = color
    }
  }
}
</script>
