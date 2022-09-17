<script lang="tsx">
import { ElInput, ElSelect } from 'element-plus'

export default defineComponent({
  components: { ElInput, ElSelect },
  props: {
    type: { type: String },
    id: { type: String },
    label: { type: String },
    required: { type: Boolean },
    value: { type: String, required: true },
    description: { type: String },
    errorMsg: { type: String },
    options: { type: Array },
    props: { type: Object },
    pattern: { type: String },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    let model = $computed({
      get() {
        return props.props?.multiple ? props.value?.split(',').filter(Boolean) : props.value
      },
      set(val: string[] | string) {
        emit('update:value', props.props?.multiple && Array.isArray(val) ? val.join(',') : val)
      },
    })

    const rules: any = [
      {
        required: props.required,
        message: '不能为空',
      },
    ]
    if (props.pattern) {
      rules.push({
        pattern: new RegExp(props.pattern),
        message: props.errorMsg,
        trigger: 'blur',
      })
    }
    return () =>
      <el-form-item label={props.label} prop={props.id} rules={rules}>
        <div className="flex-1">
          {h(
            resolveComponent(`el-${props.type}`),
            {
              ...props.props,
              'modelValue': model,
              'onUpdate:modelValue': (val: string | string[]) => model = val,
            },
            () => props?.options?.map((i: any) =>
              <el-option key={i.value} {...i} />,
            ),
          )}
          <div className="text-gray-400 text-xs mt-1">{props.description}</div>
        </div>
      </el-form-item>
  },
})
</script>

