<style scoped>
    .notification{
        background: white;
        width: 287px;
        height: 287px;

        position: absolute;
        top: 50px;
        right: 30px;

        color: black;
        font-family: 'Roboto';

        cursor: default;

        border: 1px solid rgb(228, 228, 228);
        box-shadow: 1px 3px 9px 2px rgba(0, 0, 0, 0.2);
        padding-bottom: 15px;

        overflow: auto;
    }
    .notification-title{
        font-size: 10pt;
        display: block;
        padding: 10px 3px 7px 3px;
        margin: 0 7px 0 7px;
        border-bottom: 1px solid rgb(172, 172, 172);
    }
    .notification-item{
        font-size: 11pt;
        margin: 0 7px 0 7px;
        padding-top: 5px;
        padding-bottom: 5px;
        border-bottom: 1px solid rgb(172, 172, 172);
        cursor: pointer;
    }
    .notification-item > div:nth-child(2) > div:nth-child(2){
        color: gray;
    }
    .notification-icon{
        padding: 5px;
        padding-right: 8px;
        margin-right: 8px;
        border-right: 1px solid rgb(172, 172, 172);
    }
</style>

<template>
    <div class="notification">
        <b class="notification-title">Notification ({{ notificationItems.length }})</b>
        <div v-for="i in notificationItems" v-bind:key="i.key" class="d-flex align-center justify-space-evenly notification-item">
            <v-icon
                class="notification-icon"
                color="black"
                large
            >
                mdi-email
            </v-icon>
            <div>
                <div>{{ i.notificationTitle }}</div>
                <div>{{ i.notificationTime }} ago</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotificationDialog',
    props: {
        notificationItems: Array,
    }
}
</script>