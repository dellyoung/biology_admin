<template>
  <div class="excel_out">
    <t-form
      ref="form"
      class="excel_form"
      :rule="FORM_RULES"
      :data="formData"
      :colon="true"
      label-width="150px"
      @reset="onReset"
      @submit="onSubmit"
    >
      <t-form-item label="选择类型" name="college">
        <t-select v-model="formData.type" :options="typeOptions" class="select-base" clearable />
      </t-form-item>

      <t-form-item label="是否剔除差值" name="filter">
        <t-switch v-model="formData.filter"></t-switch>
      </t-form-item>

      <t-form-item label="有效数据初始行" name="college">
        <t-input v-model="formData.beginLine" class="select-base" clearable />
      </t-form-item>

      <t-form-item label="选择文件" name="tel">
        <t-upload
          v-model="formData.fileList"
          :auto-upload="autoUpload"
          theme="file"
          :data="{ extra_data: 123, file_name: 'certificate' }"
          :abridge-name="[10, 8]"
          :format-response="formatResponse"
          draggable
          action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button theme="primary" type="submit" class="sub-btn">确认转换</t-button>
          <t-button theme="default" variant="base" type="reset" class="reset-btn">重置</t-button>
        </t-space>
      </t-form-item>
    </t-form>
    <!-- data 表示传递给上传接口的额外数据；如果有更复杂的数据场景传递，请使用 format 方法 -->
    <!-- abridgeName 表示省略文件名中间文本，保留两侧。左侧保留的文本数量，右侧保留的文本数量] -->
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { changeExcel } from './change';

const FORM_RULES = {
  type: [{ required: true, message: '类型必填' }],
  fileList: [{ required: true, message: '文件必选' }],
};

const formData = reactive({
  type: 1,
  filter: false,
  beginLine: '2',
  fileList: [],
});

const typeOptions = [{ label: '类型一', value: 1 }];

const readerFile = (raw) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(raw);
    reader.onload = (oFREvent) => {
      const pointsTxt = oFREvent.target.result;
      console.log('pointsTxt', pointsTxt); // 获取到的TXT文件
      resolve(pointsTxt);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

// sub
const onSubmit = () => {
  if (formData.fileList.length === 0) {
    MessagePlugin.error(`请先选择文件`);
    return;
  }
  formData.fileList.forEach(async (fileData) => {
    try {
      const fileName = fileData.name?.split('.')?.[0];
      const data = await readerFile(fileData.raw);
      changeExcel({ data, filter: formData.filter, fileName, beginLine: Number(formData.beginLine) });
      MessagePlugin.success('数据转换成功');
    } catch (e) {
      MessagePlugin.error(`数据转换失败`);
    }
  });
  console.log('onSubmit', formData.fileList);
};

const onReset = () => {
  formData.type = 1;
  formData.filter = false;
  formData.beginLine = '2';
  formData.fileList = [];
};

const autoUpload = ref(false);

// const files2 = ref([
//   {
//     name: '默认文件',
//     url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
//     status: 'success',
//     size: 1024,
//     // 上传日期，如果接口返回的字段包含 uploadTime，则会以接口返回的为准，默认使用本地电脑时间。
//     // 如果希望使用接口返回的上传日期，但是接口字段名不是 uploadTime，则可以使用函数 formatResponse 格式化接口数据
//     uploadTime: '2022-09-25',
//   },
// ]);

// res.url 图片地址；res.uploadTime 文件上传时间；res.error 上传失败的原因
function formatResponse(res) {
  function getCurrentDate(needTime = false) {
    const d = new Date();
    const month = d.getMonth() + 1;
    const monthnew = month < 10 ? `0${month}` : month;
    const date = `${d.getFullYear()}-${monthnew}-${d.getDate()}`;
    const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    if (needTime) return [date, time].join(' ');
    return date;
  }
  // 响应结果添加上传时间字段，用于 UI 显示
  res.uploadTime = getCurrentDate();
  return res;
}
</script>

<style lang="less" scoped>
.excel_out {
  background-color: white;
  min-height: 500px;
  border-radius: 5px;
  padding: 32px;
}
.excel_form {
  max-width: 700px;
  margin: 0 auto;
}
.sub-btn {
  width: 200px;
}
.reset-btn {
  width: 100px;
}
</style>
