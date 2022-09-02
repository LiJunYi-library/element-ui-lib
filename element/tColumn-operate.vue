
<script>
import element from 'element-ui'
export default {
  extends: element.TableColumn,
  props: {
    label: { type: String, default: '操作' },
    align: { type: String, default: 'center' },
    fixed: { type: String, default: 'right' },
    className: { type: String, default: 'bgfff' }
  }
}
</script>
