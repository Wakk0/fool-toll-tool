<template>
  <v-app id="inspire">
    <v-app-bar flat color="teal-darken-4" title="F00L T0LL T00L">
      <v-container class="fill-height d-flex align-center">
        <v-spacer></v-spacer>
      </v-container>
    </v-app-bar>

    <v-main class="bg-teal-darken-3">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet min-height="10vh" rounded="lg" class="bg-teal-darken-2 pa-1">
              <RouterView/>
            </v-sheet>
          </v-col>
        </v-row>
        <v-img src="src/assets/pngegg.png" width="200px"/>
      </v-container>
    </v-main>  
</v-app>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>