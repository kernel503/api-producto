<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="productos"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>CRUD Producto</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Agregar Producto
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
                        <v-text-field
                          v-model="editedItem.img_url"
                          label="URL del producto"
                          :rules="campoTexto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.nombre"
                          label="Nombre del producto"
                          :rules="campoTexto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.grupo_inventario"
                          label="Grupo Inventario"
                          :rules="campoTexto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          v-model="editedItem.descripcion"
                          label="Descripción"
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
        <v-icon class="mr-2" @click="openImage(item)">
          mdi-eye
        </v-icon>
        <v-icon class="mr-2" @click="editItem(item)" color="indigo">
          mdi-pencil
        </v-icon>
        <v-icon
          @click="deleteItem(item)"
          v-if="!item.opciones.length"
          color="red"
        >
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
  name: 'Producto',
  data: () => ({
    valid: true,
    dialog: false,
    snackbar: false,
    text: '',
    color: '',
    dialogDelete: false,
    campoTexto: [v => !!v || 'Debe rellenar el campo'],    
    headers: [
      {
        text: 'Nombre del producto',
        align: 'start',
        sortable: false,
        value: 'nombre'
      },
      { text: 'Grupo Inventario', value: 'grupo_inventario' },
      { text: 'Descripción', value: 'descripcion' },
      { text: 'Acciones', value: 'actions', sortable: false, align: 'center' }
    ],
    productos: [],
    editedIndex: -1,
    editedItem: {
      img_url: '',
      nombre: '',
      grupo_inventario: '',
      descripcion: ''
    },
    defaultItem: {
      img_url: '',
      nombre: '',
      grupo_inventario: '',
      descripcion: ''
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
        .then(response => (this.productos = response?.data?.data || []))
        .catch(error => {
          console.error(error)
          this.productos = []
        })
    },

    openImage (item) {
      window.open(item.img_url, '_blank').focus()
    },
    editItem (item) {
      this.editedIndex = this.productos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.productos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      const id = this.productos[this.editedIndex].id
      window.axios
        .delete('producto/eliminar', { data: { id } })
        .then(response => {
          console.log(response.data.message)
          this.notificacion(response.data.message)
          this.initialize()
        })
        .catch(error => {
          console.error(error)
          this.productos = []
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
          .put('producto/actualizar', this.editedItem)
          .then(response => {
            console.log(response.data.message)
            this.notificacion(response.data.message)
            this.initialize()
          })
          .catch(error => {
            console.error(error)
            this.productos = []
          })
      } else {
        window.axios
          .post('producto/crear', this.editedItem)
          .then(response => {
            console.log(response.data.message)
            this.notificacion(response.data.message)
            this.initialize()
          })
          .catch(error => {
            console.error(error)
            this.productos = []
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
