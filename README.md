## 使用方法

###  作者

```
- Author: Tiangg
- Date: 2021-03-05

```

### 安装

```
此能力分为三个模块 
    DragSource 拖拽区
    DropTarget 掉落区
    EditArea 编辑区

```

### 外部引用

```
const save = (values) => { console.log('保存数据:', values); };
const data = [ 
    { id: uuidv4(),  value: '初始文本',  type: 0, form: 'textArea' }, 
    { id: uuidv4(), value: '初始变量', type: 1, form: 'textArea' }, 
    { 
        id: uuidv4(), 
        value: [ 
            { id: uuidv4(), value: '组合值 1', type: 0, form: 'textArea' }, 
            { id: uuidv4(), value: '组合值 2', type: 1, form: 'textArea' }, 
        ], 
        type: 2, 
        form: 'textArea'
    }
]

<Drag save={save} jurisdiction={'read' or 'write'} data={data} status="新增时"/>

1. save: 返回文本编辑区【保存】后的数据
2. jurisdiction 接收读写的能力, 
    'read': 详情展示，不可编辑(不展示拖拽源和编辑模块)， 'write': 可编辑
3. data: 接收数据类型
4: status: 头部左边的状态

```

### 掉落区API介绍

```
一. 掉落区 <DropTarget cardProps={DProps} data={contentData} setData={setContentData}/>
1. data: 接受数据来源
2. setData: 操作数据方法

```

### 拖拽区API介绍

```
<DragSource 
    status="新增时" 
    edits={
        [ 
            <EditButton {...EProps} name="固定文本" type="primary" editAreaKey={0} />, 
            <EditButton {...EProps} name="变量" type="dashed" editAreaKey={1} />, 
            <EditButton {...EProps} name="组合" type="primary" editAreaKey={2} />, 
        ]
    } 
/>
1. status: 左侧的状态
2. edits: 右侧编辑actions集合
    2.1 editAreaKey: 对应编辑模块的编号 例如: 0-普通文本, 1-变量, 2-组合

```

### 编辑区API介绍

```
<EditArea renderContent={renderTypeMal(type, AProps)} />

<!-- 状态剥离提取 -->
子组件内部是不能用useModel()这种全局状态管理的, 状态均由父组件内部管理, 
因为此<Drag />组件后期将被以组件的形式引入并循环使用，所以，每个组建的状态均是独立的，
不可能指向同一个全局状态管理

```
