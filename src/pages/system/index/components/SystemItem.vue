<script lang="tsx">
import { ElInput, ElSelect } from 'element-plus'

export default defineComponent({
  components: { ElInput, ElSelect },
  props: {
    type: { type: String },
    id: { type: String },
    label: { type: String },
    required: { type: Boolean },
    value: { type: String },
    description: { type: String },
    options: { type: Array },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      <el-form-item label={props.label} prop={props.id} required={props.required}>
        <div className="flex-1">
          {h(
            resolveComponent(`el-${props.type}`),
            {
              'modelValue': props.value,
              'onUpdate:value': (val: string) => emit('update:value', val),
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
