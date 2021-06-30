<template>
  <div>
    <v-container>
      <v-row>
        <v-col md="4" cols="12">
          <SearchBar
            label="Search"
            @input="search = $event"
          ></SearchBar>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          v-if="genomeFiles.length == 0 && isLoadingGenomeFiles"
        >
          <v-progress-linear
            class="mt-2 px-2"
            indeterminate
            color="primary"
          ></v-progress-linear>
        </v-col>
        <v-col cols="12" class="px-4">
          <div v-if="genomeFiles.length == 0 && !isLoadingGenomeFiles">
            No test results found
          </div>
        </v-col>
        <template v-if="genomeFiles.length > 0">
          <v-col
            cols="12"
            md="4"
            v-for="file in searchGenomeFiles"
            :key="file.specimenNumber"
            class="mb-2"
          >
            <div style="position: relative;">
            <v-progress-linear
              v-if="isFileDownloading(file.specimenNumber)"
              indeterminate
              color="primary"
            ></v-progress-linear>
            <v-overlay
              absolute
              :value="isFileDownloading(file.specimenNumber)"
            >
              Downloading
            </v-overlay>
            <OrderCard
              icon="mdi-dna"
              :title="file.fileName"
              :specimenNumber="file.specimenNumber"
              :labName="file.labName"
              :timestamp="file.timestamp"
              :disabled="isDownloading"
              @click="setFileToDownload(file)"
            />
            </div>
          </v-col>
        </template>
      </v-row>
    </v-container>
    <UnlockWalletDialog
      :show="unlockWalletDialog"
      @cancel="unlockWalletDialog = false"
      @unlocked="handleDownload"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Fuse from 'fuse.js'
import { format, fromUnixTime } from 'date-fns'
import SearchBar from '@/components/DataTable/SearchBar'
import OrderCard from "@/components/OrderCard";
import UnlockWalletDialog from '@/components/UnlockWalletDialog';
import localStorage from "@/lib/local-storage";
import keystore from '@/lib/keystore';
import { SUCCESS } from '@/constants/specimen-status'
import ipfsWorker from '@/web-workers/ipfs-worker'

export default {
  name: "test-result-all",
  components: {
    OrderCard,
    SearchBar,
    UnlockWalletDialog,
  },
  computed: {
    ...mapState({
      degenicsContract: (state) => state.ethereum.contracts.contractDegenics,
    }),
    userAddress() {
      return JSON.parse(localStorage.getKeystore())["address"];
		},
		searchGenomeFiles() {
			if (!this.search) {
        return this.genomeFiles
      }
      return this.searchableGenomeFiles.search(this.search).map(obj => ({ ...obj.item }))
    },
    isDownloading() {
      return Object.keys(this.fileDownloadStates).length > 0
    }
  },
  async mounted() {
    await this.getGenomeFiles();
  },
  data: () => ({
    search: '',
    searchableGenomeFiles: null,
    genomeFiles: [],
    isLoadingGenomeFiles: false,
    unlockWalletDialog: false,
    fileToDownload: null,
    fileDownloadStates: {}, // mapping of (file's specimenNumber) => (file is downloading state)
  }),
  methods: {
    isFileDownloading(specimenNumber) {
      if (specimenNumber in this.fileDownloadStates) {
        return this.fileDownloadStates[specimenNumber]
      }
      return false
    },
    /**
     * makeSearchableList
     * 
     * Make a list of objects fuzzy searchable
     */
    makeSearchableList(list) {
      const options = {
        keys: ['fileName', 'labName', 'specimenNumber', 'date']
      }
      return new Fuse(list, options)
    },
    async getGenomeFiles() {
      this.isLoadingGenomeFiles = true;
      try {
        // Get specimens
        const specimens = await this.getSuccessSpecimens();
        // Get labs
        const labAccounts = specimens
          .map((item) => item.labAccount)
          .filter((value, index, self) => self.indexOf(value) === index);
        let labs = await this.getLabs(labAccounts);
        // labs = await this.fillLabServices(labs);
        // Get files
        let files = await this.getFilesUploaded(specimens)
        let genomeFiles = files.filter(f => f.fileType == 'genome')

        const orders = this.prepareFilesData(specimens, labs, genomeFiles);
        this.genomeFiles = orders;
        this.searchableGenomeFiles = this.makeSearchableList(orders)

        this.isLoadingGenomeFiles = false;
      } catch (err) {
        console.log(err);
        this.isLoadingGenomeFiles = false;
      }
    },
    async getFilesUploaded(specimens) {
      const specimenNumbers = specimens.map(s => s.number)
      try {
        const ks = keystore.get()
        const address = ks.address;

        const filesPromises = []
        for (let i = 0; i < specimenNumbers.length; i++) {
          const promise = await this.degenicsContract.methods
            .getFile(specimenNumbers[i]).call({from: address})
            .then(files => {
              const _files = JSON.parse(files);
              return _files.map(f => ({ ...f, specimenNumber: specimenNumbers[i] }))
            });
          filesPromises.push(promise)
        }

        let files = await Promise.all(filesPromises)
        files = files.flat() // flatten because files is [[file, file], [file], ...]

        return files

      } catch (error) {
        console.error(error)
      }
    },
    async getSuccessSpecimens() {
      try {
        const specimenCount = await this.degenicsContract.methods
          .specimenCount()
          .call({ from: this.userAddress });

        const specimensPromises = [];
        for (let i = specimenCount; i > 0; i--) {
          const promise = this.degenicsContract.methods
            .specimenByIndex(i)
            .call({ from: this.userAddress });

          specimensPromises.push(promise);
        }
        const specimens = await Promise.all(specimensPromises);
        const successSpecimens = specimens.filter(
          (spec) => spec.status == SUCCESS
        )

        return successSpecimens
      } catch (err) {
        console.log(err);
        throw new Error("Error in getting specimens: " + err.message);
      }
    },
    async getLabs(labAccounts) {
      try {
        const labPromises = [];
        for (let i = 0; i < labAccounts.length; i++) {
          const promise = await this.degenicsContract.methods
            .labByAccount(labAccounts[i])
            .call();
          labPromises.push(promise);
        }
        let labs = await Promise.all(labPromises);

        return labs;
      } catch (err) {
        console.log(err);
        throw new Error("Error in getting labs: " + err.message);
      }
    },
    /**
     * prepareFilesData
     *
     * @param {Array} specimens
     * @param {Array} labs
     * @param {Array} genomeFiles
     * @returns {Array} filesData -- files data that includes specimen info and lab name
     */
    prepareFilesData(specimens, labs, genomeFiles) {
      /*
      specimen:
        - date (timestamp) - specimenNumber - status
      lab:
        - labName
      lab product:
        - icon - title
      */
      console.log(genomeFiles)
      const files = [];

      genomeFiles.forEach(f => {
        const { specimenNumber, fileName, ipfsPath } = f
        const spec = specimens.filter(s => s.number == specimenNumber)[0]
        const { timestamp } = spec
        const date = format(fromUnixTime(timestamp), 'MMMM dd yyyy')
        const lab = labs.filter(l => l.labAccount == spec.labAccount)[0]
        const labName = lab.name

        const file = {
          fileName,
          labName,
          specimenNumber,
          ipfsPath,
          timestamp,
          date,
        }

        files.push(file)
      })

      return files.sort(
        (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
      );
    },
    setFileToDownload(file) {
      this.fileToDownload = file
      this.unlockWalletDialog = true
    },
    async handleDownload(wallet) {
      this.unlockWalletDialog = false
      const specimenNumber = this.fileToDownload.specimenNumber
      this.fileDownloadStates = { ...this.fileDownloadStates, [specimenNumber]: true }

      try {
        await this.downloadDecryptedFromIPFS(wallet.privateKey)
      } catch (err) {
        console.log('error downloading genome file', err)
      }

      this.fileDownloadStates = {}
      this.fikeToDownload = null
    },
    async downloadDecryptedFromIPFS(privateKey) {
      const channel = new MessageChannel();
      channel.port1.onmessage = ipfsWorker.workerDownload;
      let fileList = this.fileToDownload.ipfsPath;
      const typeFile = "text/plain";
      return new Promise((resolve, reject) => {
        try {
          ipfsWorker.workerDownload.postMessage({file: fileList, typeFile, privateKey}, [channel.port2]);
          ipfsWorker.workerDownload.onmessage = event => {
            this.download(event.data, this.fileToDownload.fileName)
            resolve(true)
          }
        } catch (err) {
          reject(err.message)
        }
      })
    },
    download(data, fileName) {
      const blob = new Blob([ data ], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      a.download = fileName
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    },
  },
};
</script>

<style lang="scss" scoped>
.on-hover {
  cursor: pointer;
}
</style>

