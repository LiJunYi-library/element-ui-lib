<template>
  <div class="rb-uploadImg">
    <i class="el-icon-plus avatar-uploader-icon icon" />
    <input
      class="rb-uploadImg-input"
      type="file"
      accept="image/png, image/jpeg"
      @change="handleChange"
    >
    <img v-if="base64_" :src="base64_">
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'check'
  },
  props: {
    uri: String,
    base64: String,
    file: Object,
    uploadFetch: Function
  },
  data() {
    return { imgFile: this.file, base64_: this.base64, url: this.uri }
  },
  methods: {
    handleChange(e) {
      this.imgFile = e.target.files[0];
      var reader = new FileReader()
      reader.readAsDataURL(this.imgFile)
      reader.onload = async(e) => {
        this.base64_ = reader.result
        this.$emit('update:base64', this.base64_)
        this.$emit('update:file', this.imgFile)
        this.$emit('check', this.imgFile)
        this.$emit('change', this.imgFile, this.base64_)
        if (!this.uploadFetch) return
        this.url = await this.uploadFetch(this.imgFile, this.base64_)
        this.$emit('update:uri', this.url)
      }
    }
  }
}
</script>
<style>
.rb-uploadImg img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.rb-uploadImg .rb-uploadImg-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: 20;
}
.rb-uploadImg {
  width: 120px;
  height: 120px;
  display: inline-flex;
  position: relative;
  background: #eeeeee;
}
.rb-uploadImg .icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>
