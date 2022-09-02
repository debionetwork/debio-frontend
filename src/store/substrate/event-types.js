export const masterConfigEvent = {
  role: {
    lab: {
      labs: {
        LabUpdateVerificationStatus: {
          value: "accountId",
          value_message: "Your account has been",
          route: "",
          params: "",
          identity: "accountId"
        }
      },
      
      orders: {
        OrderPaid: {
          value: "id",
          value_message: (hash) => {
            return `A new order ${hash} is awaiting process.`
          },
          route: "lab-dashboard-process-order",
          params: "orderId",
          identity: "sellerId"
        },
        OrderRefunded: {
          value: "id",
          value_message: (amount, id) => {
            return `You've received ${amount} as quality control fees for <${id}>.`
          },
          route: "lab-dashboard-process-order",
          params: "orderId",
          identity: "sellerId"
        },
        OrderFulfilled: {
          value: "id",
          value_message: (amount, id) => {
            return `You’ve received ${amount} for completeing the requested test for <${id}> from the service requested.`
          },
          route: "lab-dashboard-process-order",
          params: "orderId",
          identity: "sellerId"
        }
      },

      serviceRequest: {
        ServiceRequestClaimed: {
          value: "serviceId",
          value_message: "Congrats! Your requested service is available now. See your stake service.",
          route: "my-test",
          params: "1",
          identity: 0
        }
      },

      geneticTesting: {
        DnaSampleResultReady: {
          value: "orderId",
          value_message: (amount) => {
            return `You've received ${amount} for completeing the requested test"`
          },
          route: "lab-dashboard-process-order",
          params: "orderId",
          identity: "ownerId"
        }
      },

      rewards: {
        RewardFunds: {
          value: 0,
          value_message: "Congrats! You’ve received 1",
          route: "",
          params: "",
          identity: 0
        }
      },

      services: {
        ServiceCreated: {
          value: "id",
          value_message: "You've successfully added your new service -",
          route: "lab-dashboard-services-detail",
          params: "id",
          identity: "ownerId"
        }
      }
    }
  }
}
