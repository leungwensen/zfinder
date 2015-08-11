
# Markdown Cheatsheet

## headings

# Heading 1 #

    Markup :  # Heading 1 #

## Heading 2 ##

    Markup :  ## Heading 2 ##

### Heading 3 ###

    Markup :  ### Heading 3 ###

#### Heading 4 ####

    Markup :  #### Heading 4 ####


## Common text

    Markup :  Common text

## _Emphasized text_

    Markup :  _Emphasized text_ or *Emphasized text*

## ~~Strikethrough text~~

    Markup :  ~~Strikethrough text~~

## __Strong text__

    Markup :  __Strong text__ or **Strong text**

## ___Strong emphasized text___

    Markup :  ___Strong emphasized text___ or ***Strong emphasized text***

## links

[Named Link](http://www.google.fr/) and http://www.google.fr/ or <http://example.com/>

    Markup :  [Named Link](http://www.google.fr/) and http://www.google.fr/ or <http://example.com/>

## Table, like this one :

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

```
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
```

## `code`

    Markup :  `code()`

```javascript
    var specificLanguage_code =
    {
        "data": {
            "lookedUpPlatform": 1,
            "query": "Kasabian+Test+Transmission",
            "lookedUpItem": {
                "name": "Test Transmission",
                "artist": "Kasabian",
                "album": "Kasabian",
                "picture": null,
                "link": "http://open.spotify.com/track/5jhJur5n4fasblLSCOcrTp"
            }
        }
    }
```

    Markup : ```javascript
             ```

## bullet list

* Bullet list
 * Nested bullet
  * Sub-nested bullet etc
* Bullet list item 2

~~~
 Markup : * Bullet list
           * Nested bullet
            * Sub-nested bullet etc
          * Bullet list item 2
~~~

## numbered list

1. A numbered list
 1. A nested numbered list
 2. Which is numbered
2. Which is numbered

~~~
 Markup : 1. A numbered list
           1. A nested numbered list
           2. Which is numbered
          2. Which is numbered
~~~

## Blockquote

> Blockquote
>> Nested blockquote

    Markup :  > Blockquote
              >> Nested Blockquote

## Horizontal line

- - - -

    Markup :  - - - -

## Image with alt

![picture alt](http://www.brightlightpictures.com/assets/images/portfolio/thethaw_header.jpg "Title is optional")

    Markup : ![picture alt](http://www.brightlightpictures.com/assets/images/portfolio/thethaw_header.jpg "Title is optional")


## drawing diagrams with [knsv/mermaid](https://github.com/knsv/mermaid)

### graphs

```
graph TB
    subgraph one
        a1-->a2
    end
    subgraph two
        b1-->b2
    end
    subgraph three
        c1-->c2
    end
    c1-->a2
```

markup:

```markdown
graph TB
    subgraph one
        a1-->a2
    end
    subgraph two
        b1-->b2
    end
    subgraph three
        c1-->c2
    end
    c1-->a2
```

```
graph LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
    E --> F((Circle end))
    D --> F
```

markup:

```markdown
graph LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
    E --> F((Circle end))
    D --> F
```

### sequence diagram

```
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
```

markup:

```markdown
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
```

### gantt diagram

```
gantt
    dateFormat  YYYY-MM-DD
    title Adding GANTT diagram functionality to mermaid

    section A section
    Completed task     :done,    des1, 2014-01-06,2014-01-08
    Active task        :active,  des2, 2014-01-09, 3d
    Future task        :         des3, after des2, 5d
    Future task2       :         des4, after des3, 5d

    section Critical tasks
    Completed task in the critical line :crit, done, 2014-01-06,24h
    Implement parser and jison          :crit, done, after des1, 2d
    Create tests for parser             :crit, active, 3d
    Future task in critical line        :crit, 5d
    Create tests for renderer           :2d
    Add to mermaid                      :1d

    section Documentation
    Describe gantt syntax               :active, a1, after des1, 3d
    Add gantt diagram to demo page      :after a1  , 20h
    Add another diagram to demo page    :doc1, after a1  , 48h

    section Last section
    Describe gantt syntax               :after doc1, 3d
    Add gantt diagram to demo page      : 20h
    Add another diagram to demo page    : 48h
```

markup:

```markdown
gantt
    dateFormat  YYYY-MM-DD
    title Adding GANTT diagram functionality to mermaid

    section A section
    Completed task     :done,    des1, 2014-01-06,2014-01-08
    Active task        :active,  des2, 2014-01-09, 3d
    Future task        :         des3, after des2, 5d
    Future task2       :         des4, after des3, 5d

    section Critical tasks
    Completed task in the critical line :crit, done, 2014-01-06,24h
    Implement parser and jison          :crit, done, after des1, 2d
    Create tests for parser             :crit, active, 3d
    Future task in critical line        :crit, 5d
    Create tests for renderer           :2d
    Add to mermaid                      :1d

    section Documentation
    Describe gantt syntax               :active, a1, after des1, 3d
    Add gantt diagram to demo page      :after a1  , 20h
    Add another diagram to demo page    :doc1, after a1  , 48h

    section Last section
    Describe gantt syntax               :after doc1, 3d
    Add gantt diagram to demo page      : 20h
    Add another diagram to demo page    : 48h
```

## flow chart using [adrai/flowchart.js](https://github.com/adrai/flowchart.js)

```
flowchart
    st=>start: Start|past:>http://www.google.com[blank]
    e=>end: Ende|future:>http://www.google.com
    op1=>operation: My Operation|past
    op2=>operation: Stuff|current
    sub1=>subroutine: My Subroutine|invalid
    cond=>condition: Yes
    or No?|approved:>http://www.google.com
    c2=>condition: Good idea|rejected
    io=>inputoutput: catch something...|future

    st->op1(right)->cond
    cond(yes, right)->c2
    cond(no)->sub1(left)->op1
    c2(yes)->io->e
    c2(no)->op2->e
```

markup:

```markdown
flowchart
    st=>start: Start|past:>http://www.google.com[blank]
    e=>end: Ende|future:>http://www.google.com
    op1=>operation: My Operation|past
    op2=>operation: Stuff|current
    sub1=>subroutine: My Subroutine|invalid
    cond=>condition: Yes
    or No?|approved:>http://www.google.com
    c2=>condition: Good idea|rejected
    io=>inputoutput: catch something...|future

    st->op1(right)->cond
    cond(yes, right)->c2
    cond(no)->sub1(left)->op1
    c2(yes)->io->e
    c2(no)->op2->e
```

## Latex math typesetting support by [Khan/KaTeX](https://github.com/Khan/KaTeX)

```
math
    f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
```

markup:

```markdown
math
    f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
```

## github-like task list


- [ ] unchecked list item
- [x] checked list item

markup:

```markdown
- [ ] unchecked list item
- [x] checked list item
```

## emoji :+1:

`I :laughing: when I am :)` --> I :laughing: when I am :)

## table of content

## theme switching support

## sync the scrolling of editor and previewer


