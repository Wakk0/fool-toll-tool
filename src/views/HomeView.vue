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
                Recommended:
                  <v-list :items="item.raw.recommendations"/>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>

 <v-card title="DISCLOSURE" class="ma-4 bg-teal-darken-1">
  <v-card-text>
    This web application was not created in connection with any specific company. Rather, it was developed to meet the need for programmatic comparison of postcode and suburb combinations in Australia for toll failing manifests.
  </v-card-text>
 </v-card>

 <v-card title="USE" class="ma-4 bg-teal-darken-1">
  <v-card-text>
    This software is completely open to the public and free to use without any restrictions.
  </v-card-text>
 </v-card>

 <v-card title="ABOUT" class="ma-4 bg-teal-darken-1">
  <v-card-text>
    Please be aware that this software is licensed under GPL-v2, which specifies the terms and conditions of its use. You are welcome to suggest updates or new features, which I will gladly review and commit.
    <a href="https://github.com/Wakk0/fool-toll-tool">Sources are available in my abandoned GitHub account x-D</a>
  </v-card-text>
 </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { toll_data } from '@/js/toll_data.js'

const headers = ref([
  { title: 'Shipment ID', align: 'start', sortable: false, key: 'shipmentid'},
  { title: 'PP #', key: 'ppnum' },
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
    items.value[i].recommendations = []
    for(let x = 0 ; x < toll_data.length; x++){

      if(items.value[i].suburb.toUpperCase() == toll_data[x].suburb || slugnize(items.value[i].suburb.toUpperCase()) == toll_data[x].suburb ){
        items.value[i].recommendations.push(`Postcode: ${toll_data[x].postcode} - Suburb: ${toll_data[x].suburb}`)
      }

      if(items.value[i].postcode == toll_data[x].postcode){
        if(items.value[i].suburb.toUpperCase() == toll_data[x].suburb){
          break
        }
        items.value[i].recommendations.push(`Postcode: ${toll_data[x].postcode} - Suburb: ${toll_data[x].suburb}`)
      }

      if(x+1 == toll_data.length){
        items.value[i].status = 1
        newItems.push(items.value[i])
      }
    }
  }
  tableTitle.value = 'Consigments Report'
  items.value = newItems
  showInputs.value = false
}

const slugnize = (name) => {
  if(name.includes('-')){
    return name.replace(/-/g,' ')
  } else if(name.includes(' ')){
    return name.replace(/ /g,'-')
  }
  return name
  // if(name.includes('-')) return name.replace(/-/g,' ')
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
      ppnum: shipments[i].References.reference[1].ReferenceValue,
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