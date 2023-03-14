<template>
  <div class="ma-2">
    <v-file-input v-model="jsonfile" @change="fileChange" label="Submit Manifest JSON" show-size >
      <template v-slot:append>
        <v-btn v-if="jsonfile" @click.prevent="processFile" color="teal-accent-4" class="mb-2">Check Addresses</v-btn>
      </template>
    </v-file-input>
    <v-card v-if="jsonfile" :title="tableTitle" class="ma-4 bg-teal-darken-1">
      <v-card-text>
        <v-data-table :headers="headers" :items="items" class="elevation-6" density="compact" item-key="shipment" show-expand>
          <template v-slot:item.shipmentid="{ item }">
            <v-chip :color="getColor(item.raw.status)">
              {{ item.raw.shipmentid }}
            </v-chip>
          </template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr v-if="!showInputs">
              <td :colspan="columns.length">
                Suggested suburbs base on the postcode: {{ item.raw.rsuburb }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toll_data } from '@/js/toll_data.js'

const headers = ref([
  { title: 'Shipment ID', align: 'start', sortable: false, key: 'shipmentid'},
  { title: 'Address', key: 'address' },
  { title: 'Suburb', key: 'suburb' },
  { title: 'Postcode', key: 'postcode' },
  { title: 'State', key: 'state' }
])

const tableTitle = ref('File Content')
const items = ref([])
const jsonfile = ref(null)
const showInputs = ref(true)

const processFile = () => {
  let newItems = []
  for(let i = 0 ; i < items.value.length; i++){
    for(let x = 0 ; x < toll_data.length; x++){
      if(items.value[i].postcode == toll_data[x].postcode){
        if(items.value[i].suburb.toUpperCase() == toll_data[x].suburb){
          // console.log('Matching:',items.value[i])
          // items.value[i].status = 0
          // newItems.push(items.value[i])
          break
        } 
      }

      if(x+1 == toll_data.length){
        // console.log('Non-Matching:',items.value[i])

        let suggestions = []
        toll_data.filter( (address) => {
          if(address.postcode == items.value[i].postcode){
            suggestions.push(address.suburb)
          }
        })

        items.value[i].status = 1
        items.value[i].rsuburb = suggestions
        newItems.push(items.value[i])
      }
    }
  }
  tableTitle.value = 'Consigments Report'
  items.value = newItems
  showInputs.value = false
}

const fileChange = async (e) => {
  items.value =[]
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = (e) => { 
  const results = JSON.parse(e.target.result)
  const shipments = results.request.TollMessage.Manifest.ShipmentCollection.Shipment
    
  for(let i = 0; i < shipments.length; i++){
    items.value.push({
      shipmentid: shipments[i].ShipmentID,
      address: shipments[i].ConsigneeParty.PhysicalAddress.AddressLine1,
      suburb: shipments[i].ConsigneeParty.PhysicalAddress.Suburb,
      postcode: shipments[i].ConsigneeParty.PhysicalAddress.PostalCode,
      state: shipments[i].ConsigneeParty.PhysicalAddress.StateCode
    })
  }

  }
  await reader.readAsText(file)
}

const getColor = (status) => {
  if (status == 1) return 'red'
    else if (status == 0 ) return 'green'
  else return ''
}

</script>